from __future__ import annotations

import json
import time
from datetime import date
from email.utils import parsedate_to_datetime
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from vyom_literature.records import LiteratureRecord
from vyom_literature.sources import parse_europepmc_results, parse_pubmed_xml


RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}


def _retry_delay(error: HTTPError, attempt: int) -> float:
    retry_after = error.headers.get("Retry-After")
    if retry_after:
        try:
            return min(float(retry_after), 60)
        except ValueError:
            try:
                return min(
                    max((parsedate_to_datetime(retry_after).timestamp() - time.time()), 0), 60
                )
            except (TypeError, ValueError, OverflowError):
                pass
    return min(2**attempt, 30)


def _get_bytes(url: str, params: dict[str, Any], *, user_agent: str) -> bytes:
    request = Request(
        f"{url}?{urlencode(params)}",
        headers={"Accept": "application/json, application/xml", "User-Agent": user_agent},
    )
    for attempt in range(5):
        try:
            with urlopen(request, timeout=30) as response:
                return response.read()
        except HTTPError as error:
            if error.code not in RETRYABLE_STATUS_CODES or attempt == 4:
                raise
            time.sleep(_retry_delay(error, attempt))
        except URLError:
            if attempt == 4:
                raise
            time.sleep(min(2**attempt, 30))
    raise RuntimeError("Request retries exhausted")


class PubMedClient:
    def __init__(self, *, tool: str, email: str, api_key: str | None = None):
        if not tool.strip() or not email.strip():
            raise ValueError("NCBI_TOOL and NCBI_EMAIL are required for PubMed")
        self.tool = tool
        self.email = email
        self.api_key = api_key
        self.minimum_interval = 0.1 if api_key else 1 / 3
        self.last_request_at = 0.0

    def _request(self, endpoint: str, params: dict[str, Any]) -> bytes:
        elapsed = time.monotonic() - self.last_request_at
        if elapsed < self.minimum_interval:
            time.sleep(self.minimum_interval - elapsed)
        params.update({"tool": self.tool, "email": self.email})
        if self.api_key:
            params["api_key"] = self.api_key
        payload = _get_bytes(
            f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/{endpoint}.fcgi",
            params,
            user_agent=f"{self.tool} ({self.email})",
        )
        self.last_request_at = time.monotonic()
        return payload

    def fetch(
        self,
        query: str,
        *,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> list[LiteratureRecord]:
        search_params: dict[str, Any] = {
            "db": "pubmed",
            "term": query,
            "retmode": "json",
            "retmax": 0,
        }
        if from_date and to_date:
            search_params.update(
                {
                    "datetype": "edat",
                    "mindate": from_date.strftime("%Y/%m/%d"),
                    "maxdate": to_date.strftime("%Y/%m/%d"),
                }
            )
        search = json.loads(self._request("esearch", search_params))
        search_result = search["esearchresult"]
        count = int(search_result["count"])
        if count > 10_000:
            raise ValueError("PubMed query exceeds 10,000 records; narrow the date range")

        ids = search_result.get("idlist", [])
        records = []
        for offset in range(0, count, 200):
            page_ids = ids[offset : offset + 200]
            if not page_ids:
                page = json.loads(
                    self._request(
                        "esearch",
                        {**search_params, "retstart": offset, "retmax": min(200, count - offset)},
                    )
                )
                page_ids = page["esearchresult"].get("idlist", [])
            if not page_ids:
                break
            payload = self._request(
                "efetch",
                {"db": "pubmed", "id": ",".join(page_ids), "retmode": "xml"},
            )
            records.extend(parse_pubmed_xml(payload))
        return records


class EuropePMCClient:
    endpoint = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"

    def __init__(self, *, tool: str, email: str):
        self.user_agent = f"{tool} ({email})" if tool and email else "VyomLiteraturePrototype/0.1"

    def fetch(
        self,
        query: str,
        *,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> list[LiteratureRecord]:
        search_query = query
        if from_date and to_date:
            search_query = f"({query}) AND FIRST_PDATE:[{from_date.isoformat()} TO {to_date.isoformat()}]"

        cursor = "*"
        records = []
        while True:
            payload = json.loads(
                _get_bytes(
                    self.endpoint,
                    {
                        "query": search_query,
                        "format": "json",
                        "resultType": "core",
                        "pageSize": 1000,
                        "cursorMark": cursor,
                    },
                    user_agent=self.user_agent,
                )
            )
            records.extend(parse_europepmc_results(payload))
            next_cursor = payload.get("nextCursorMark")
            if not next_cursor or next_cursor == cursor:
                break
            cursor = next_cursor
        return records