from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any, Iterable, Protocol

from vyom_literature.dedup import make_dedup_key
from vyom_literature.ledger import (
    append_sys1_decision,
    append_sys2_synthesis,
    has_sys1_decision,
    record_state_and_source,
)
from vyom_literature.records import LiteratureRecord


class LiteratureRouter(Protocol):
    def evaluate(self, domain: str, normalized_state: dict[str, Any]) -> dict[str, Any]: ...


@dataclass(frozen=True)
class SweepStats:
    fetched: int = 0
    invalid: int = 0
    states_created: int = 0
    sources_created: int = 0
    decisions_created: int = 0
    decisions_already_present: int = 0
    syntheses_created: int = 0


def _first_author(authors: list[dict[str, str]]) -> str | None:
    if not authors:
        return None
    return authors[0].get("surname") or authors[0].get("name")


def _publication_date(record: LiteratureRecord) -> date | None:
    if record.pub_date:
        return record.pub_date
    if record.publication_year:
        return date(record.publication_year, 1, 1)
    return None


def screen_public_records(
    records: Iterable[LiteratureRecord],
    *,
    connection: Any,
    router: LiteratureRouter,
    strategy_id: int | None = None,
    system_two_router: Any | None = None,
) -> SweepStats:
    fetched = invalid = states_created = sources_created = decisions_created = already_present = syntheses_created = 0
    for record in records:
        fetched += 1
        if not record.source_uid or not record.title.strip():
            invalid += 1
            continue

        normalized_state = {
            "domain": "pv_literature",
            "pmid": record.pmid,
            "doi": record.doi,
            "title": record.title,
            "abstract": record.abstract or "",
            "journal": record.journal,
            "pub_date": record.pub_date.isoformat() if record.pub_date else None,
            "publication_year": record.publication_year,
            "authors": record.authors,
        }
        dedup_key = make_dedup_key(
            doi=record.doi,
            pmid=record.pmid,
            title=record.title,
            first_author=_first_author(record.authors),
            pub_date=_publication_date(record),
            publication_year=record.publication_year,
        )
        state_write = record_state_and_source(
            connection,
            domain="pv_literature",
            dedup_key=dedup_key,
            title_or_header=record.title,
            normalized_state=normalized_state,
            source=record.source,
            source_uid=record.source_uid,
            raw_payload=record.raw,
            strategy_id=strategy_id,
        )
        states_created += int(state_write.state_created)
        sources_created += int(state_write.source_created)

        existing_decision = {
            "model_id": router.public_model,
            "sampler_version": router.sampler_version,
            "question_schema_version": router.question_schema_version,
            "threshold_policy_version": router.threshold_policy_version,
            "state_sha256": state_write.state_sha256,
        }
        if has_sys1_decision(connection, state_id=state_write.state_id, decision=existing_decision):
            already_present += 1
            continue

        decision = router.evaluate("pv_literature", state_write.normalized_state)
        if decision["state_sha256"] != state_write.state_sha256:
            raise ValueError("router evaluated a different state than the one stored in the ledger")
        decision_id = append_sys1_decision(connection, state_id=state_write.state_id, decision=decision)
        decisions_created += 1
        if system_two_router is not None:
            synthesis = system_two_router.synthesize(
                domain="pv_literature",
                state=state_write.normalized_state,
                decision=decision,
            )
            if synthesis is not None:
                append_sys2_synthesis(
                    connection,
                    decision_id=decision_id,
                    synthesis=synthesis,
                )
                syntheses_created += 1

    return SweepStats(
        fetched=fetched,
        invalid=invalid,
        states_created=states_created,
        sources_created=sources_created,
        decisions_created=decisions_created,
        decisions_already_present=already_present,
        syntheses_created=syntheses_created,
    )