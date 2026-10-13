from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Protocol

from vyom_literature.batches import (
    BatchRequest,
    CollectedResult,
    build_batch_requests,
    collect_batch,
    submit_batch,
)
from vyom_literature.screening import (
    PROMPT_VERSION,
    RULE_VERSION,
    SECOND_LOOK_MODEL,
    TRIAGE_MODEL,
    apply_deterministic_rules,
    triage_requires_second_look,
    validate_screening,
)


MAX_BATCH_AGE = timedelta(hours=24)
MAX_BATCH_ATTEMPTS = 3


class Store(Protocol):
    def candidates(self, pass_name: str, article_ids: list[int] | None = None) -> list[dict[str, Any]]: ...
    def article(self, article_id: int) -> dict[str, Any] | None: ...
    def save_batch_job(self, **kwargs: Any) -> None: ...
    def pending_batches(self) -> list[dict[str, Any]]: ...
    def save_screening(self, **kwargs: Any) -> bool: ...
    def finish_batch(self, provider_id: str, status: str) -> None: ...


class Provider(Protocol):
    def submit(self, requests: list[BatchRequest]) -> str: ...
    def collect(self, provider_id: str) -> tuple[bool, list[CollectedResult]]: ...


class AnthropicProvider:
    def __init__(self, api_key: str):
        from anthropic import Anthropic

        self.client = Anthropic(api_key=api_key)

    def submit(self, requests: list[BatchRequest]) -> str:
        return submit_batch(self.client, requests)

    def collect(self, provider_id: str) -> tuple[bool, list[CollectedResult]]:
        return collect_batch(self.client, provider_id)


def submit_pass(
    store: Store,
    provider: Provider,
    pass_name: str,
    *,
    article_ids: list[int] | None = None,
    attempt: int = 1,
) -> str | None:
    articles = store.candidates(pass_name, article_ids)
    if not articles:
        return None
    first_pass = {
        article["id"]: article["triage_payload"]
        for article in articles
        if article.get("triage_payload") is not None
    }
    requests = build_batch_requests(articles, pass_name=pass_name, first_pass=first_pass)
    provider_id = provider.submit(requests)
    model_id = TRIAGE_MODEL if pass_name == "triage" else SECOND_LOOK_MODEL
    store.save_batch_job(
        provider_id=provider_id,
        pass_name=pass_name,
        model_id=model_id,
        prompt_version=PROMPT_VERSION,
        requests=requests,
        attempt=attempt,
    )
    return provider_id


def _result_ids(results: list[CollectedResult]) -> set[str]:
    return {result.custom_id for result in results}


def _screening_payload(store: Store, result: CollectedResult) -> dict[str, Any]:
    article = store.article(result.article_id)
    if article is None or result.payload is None:
        raise ValueError("article or result payload is missing")
    payload = validate_screening(result.payload, article.get("abstract") or "")
    if result.pass_name == "second_look":
        molecules = article.get("molecules") or [""]
        payload["deterministic_rules"] = {
            molecule: apply_deterministic_rules(
                payload,
                molecule=molecule,
                title=article["title"],
                abstract=article.get("abstract") or "",
                pub_date=article.get("pub_date"),
            ).as_dict()
            for molecule in molecules
        }
    return payload


def collect_ready(
    store: Store,
    provider: Provider,
    *,
    now: datetime | None = None,
) -> dict[str, int]:
    current_time = now or datetime.now(timezone.utc)
    stats = {"waiting": 0, "ingested": 0, "failed": 0, "retried": 0, "second_look_submitted": 0}
    second_look_ids: set[int] = set()

    for job in store.pending_batches():
        ended, results = provider.collect(job["provider_id"])
        age = current_time - job["submitted_at"]
        if not ended and age < MAX_BATCH_AGE:
            stats["waiting"] += 1
            continue

        retry_ids: set[int] = set()
        if ended:
            returned_ids = _result_ids(results)
            expected_ids = set(job["custom_ids"])
            for custom_id in expected_ids - returned_ids:
                try:
                    retry_ids.add(int(custom_id.rsplit(":", maxsplit=1)[1]))
                except (ValueError, IndexError):
                    continue

            for result in results:
                if result.error:
                    retry_ids.add(result.article_id)
                    continue
                try:
                    payload = _screening_payload(store, result)
                    inserted = store.save_screening(
                        article_id=result.article_id,
                        pass_name=result.pass_name,
                        model_id=result.model_id,
                        prompt_version=result.prompt_version,
                        rule_version=RULE_VERSION,
                        batch_id=job["provider_id"],
                        payload=payload,
                    )
                    if inserted and result.pass_name == "triage" and triage_requires_second_look(payload):
                        second_look_ids.add(result.article_id)
                    stats["ingested"] += int(inserted)
                except (ValueError, TypeError, KeyError):
                    retry_ids.add(result.article_id)

            store.finish_batch(job["provider_id"], "ingested")
        else:
            for custom_id in job["custom_ids"]:
                try:
                    retry_ids.add(int(custom_id.rsplit(":", maxsplit=1)[1]))
                except (ValueError, IndexError):
                    continue
            store.finish_batch(job["provider_id"], "failed")

        if retry_ids:
            if job["attempt"] < MAX_BATCH_ATTEMPTS:
                retried_id = submit_pass(
                    store,
                    provider,
                    job["pass_name"],
                    article_ids=sorted(retry_ids),
                    attempt=job["attempt"] + 1,
                )
                stats["retried"] += int(retried_id is not None)
            else:
                stats["failed"] += len(retry_ids)

    if second_look_ids:
        submitted = submit_pass(store, provider, "second_look", article_ids=sorted(second_look_ids))
        stats["second_look_submitted"] = int(submitted is not None)
    return stats