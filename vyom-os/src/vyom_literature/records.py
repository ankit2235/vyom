from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any, Literal


@dataclass(frozen=True)
class LiteratureRecord:
    source: Literal["pubmed", "europepmc"]
    source_uid: str
    pmid: str | None
    doi: str | None
    title: str
    abstract: str | None
    journal: str | None
    pub_date: date | None
    publication_year: int | None
    authors: list[dict[str, str]]
    raw: dict[str, Any]