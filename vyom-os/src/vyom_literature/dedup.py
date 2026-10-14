from __future__ import annotations

import re
from datetime import date


def normalize_doi(doi: str | None) -> str | None:
    if not doi:
        return None

    normalized = doi.strip().casefold()
    normalized = re.sub(r"^https?://(?:dx\.)?doi\.org/", "", normalized)
    normalized = re.sub(r"^doi:\s*", "", normalized)
    normalized = normalized.rstrip(".,; ")
    return normalized or None


def normalize_pmid(pmid: str | None) -> str | None:
    if not pmid:
        return None

    normalized = re.sub(r"^pmid:\s*", "", pmid.strip(), flags=re.IGNORECASE)
    return normalized if normalized.isdigit() else None


def make_dedup_key(
    *,
    doi: str | None,
    pmid: str | None,
    title: str,
    first_author: str | None,
    pub_date: date | None,
    publication_year: int | None = None,
) -> str:
    normalized_doi = normalize_doi(doi)
    if normalized_doi:
        return f"doi:{normalized_doi}"

    normalized_pmid = normalize_pmid(pmid)
    if normalized_pmid:
        return f"pmid:{normalized_pmid}"

    year = publication_year or (pub_date.year if pub_date else None)
    if not first_author or year is None or not title.strip():
        raise ValueError("Fuzzy deduplication requires title, first author, and year")

    title_slug = re.sub(r"[^\w]+", "-", title.casefold(), flags=re.UNICODE).strip("-")
    author_surname = re.sub(
        r"[^\w]+", "", first_author.casefold().split(",", maxsplit=1)[0], flags=re.UNICODE
    )
    if not title_slug or not author_surname:
        raise ValueError("Fuzzy deduplication requires a non-empty title and author")

    return f"fuzzy:{title_slug}:{author_surname}:{year}"