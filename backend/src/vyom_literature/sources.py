from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from datetime import date, datetime
from typing import Any

from vyom_literature.records import LiteratureRecord


def _text(element: ET.Element | None) -> str | None:
    if element is None:
        return None
    value = " ".join("".join(element.itertext()).split())
    return value or None


def _pubmed_date(article: ET.Element) -> tuple[date | None, int | None]:
    date_element = article.find(".//PubDate")
    if date_element is None:
        return None, None

    year_text = _text(date_element.find("Year"))
    if year_text is None:
        medline_date = _text(date_element.find("MedlineDate")) or ""
        match = re.search(r"\b(?:19|20)\d{2}\b", medline_date)
        year_text = match.group(0) if match else None

    try:
        year = int(year_text) if year_text else None
    except ValueError:
        year = None
    if year is None:
        return None, None

    month_text = _text(date_element.find("Month"))
    day_text = _text(date_element.find("Day"))
    if not month_text:
        return None, year

    try:
        month = int(month_text)
    except ValueError:
        month_match = re.match(r"[A-Za-z]{3}", month_text)
        if not month_match:
            return None, year
        try:
            month = datetime.strptime(month_match.group(0), "%b").month
        except ValueError:
            return None, year

    try:
        day = int(day_text) if day_text else 1
        return date(year, month, day), year
    except ValueError:
        return None, year


def parse_pubmed_xml(payload: bytes) -> list[LiteratureRecord]:
    root = ET.fromstring(payload)
    records = []
    for article in root.findall(".//PubmedArticle"):
        citation = article.find(".//MedlineCitation")
        article_element = article.find(".//MedlineCitation/Article")
        if citation is None or article_element is None:
            continue

        pmid = _text(citation.find("PMID"))
        title = _text(article_element.find("ArticleTitle")) or ""
        abstract_parts = [
            text
            for abstract_part in article_element.findall(".//Abstract/AbstractText")
            if (text := _text(abstract_part))
        ]
        authors = []
        for author in article_element.findall(".//AuthorList/Author"):
            surname = _text(author.find("LastName"))
            initials = _text(author.find("Initials"))
            if surname:
                authors.append({"surname": surname, "initials": initials or ""})

        doi = next(
            (
                value
                for article_id in article.findall(".//ArticleId")
                if article_id.attrib.get("IdType") == "doi"
                and (value := _text(article_id))
            ),
            None,
        )
        publication_date, publication_year = _pubmed_date(article_element)
        journal = _text(article_element.find(".//Journal/Title"))
        raw_xml = ET.tostring(article, encoding="unicode")
        records.append(
            LiteratureRecord(
                source="pubmed",
                source_uid=pmid or "",
                pmid=pmid,
                doi=doi,
                title=title,
                abstract="\n".join(abstract_parts) or None,
                journal=journal,
                pub_date=publication_date,
                publication_year=publication_year,
                authors=authors,
                raw={"xml": raw_xml},
            )
        )
    return records


def _europepmc_date(value: str | None, year_value: str | None) -> tuple[date | None, int | None]:
    if value:
        try:
            parsed = date.fromisoformat(value[:10])
            return parsed, parsed.year
        except ValueError:
            pass
    try:
        return None, int(year_value) if year_value else None
    except ValueError:
        return None, None


def parse_europepmc_results(payload: dict[str, Any]) -> list[LiteratureRecord]:
    records = []
    for item in payload.get("resultList", {}).get("result", []):
        source_uid = item.get("id")
        title = " ".join((item.get("title") or "").split())
        if not source_uid:
            continue

        author_list = item.get("authorList", {}).get("author", [])
        if isinstance(author_list, dict):
            author_list = [author_list]
        authors = []
        for author in author_list:
            surname = author.get("lastName")
            full_name = author.get("fullName") or author.get("name") or ""
            if surname or full_name:
                authors.append({"surname": surname or full_name.split()[0], "name": full_name})
        if not authors:
            authors = [
                {"surname": author.strip().split()[0], "name": author.strip()}
                for author in (item.get("authorString") or "").split(",")
                if author.strip()
            ]
        publication_date, publication_year = _europepmc_date(
            item.get("firstPublicationDate"), item.get("pubYear")
        )
        records.append(
            LiteratureRecord(
                source="europepmc",
                source_uid=str(source_uid),
                pmid=str(item["pmid"]) if item.get("pmid") else None,
                doi=item.get("doi"),
                title=title,
                abstract=item.get("abstractText") or None,
                journal=item.get("journalTitle") or None,
                pub_date=publication_date,
                publication_year=publication_year,
                authors=authors,
                raw=item,
            )
        )
    return records