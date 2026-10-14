from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

from vyom_literature.dedup import make_dedup_key, normalize_doi, normalize_pmid
from vyom_literature.records import LiteratureRecord


@dataclass(frozen=True)
class SaveStats:
    inserted: int = 0
    already_seen: int = 0


def _first_author(authors: list[dict[str, str]]) -> str | None:
    if not authors:
        return None
    first = authors[0]
    return first.get("surname") or first.get("name")


def _article_id(cursor: Any, record: LiteratureRecord) -> int:
    doi = normalize_doi(record.doi)
    pmid = normalize_pmid(record.pmid)

    if doi:
        cursor.execute("select id from articles where doi = %s limit 1", (doi,))
        row = cursor.fetchone()
        if row:
            article_id = row[0]
            cursor.execute(
                "update articles set pmid = coalesce(pmid, %s), abstract = coalesce(abstract, %s) where id = %s",
                (pmid, record.abstract, article_id),
            )
            return article_id

    if pmid:
        cursor.execute("select id from articles where pmid = %s limit 1", (pmid,))
        row = cursor.fetchone()
        if row:
            article_id = row[0]
            cursor.execute(
                "update articles set doi = coalesce(doi, %s), abstract = coalesce(abstract, %s) where id = %s",
                (doi, record.abstract, article_id),
            )
            return article_id

    dedup_key = make_dedup_key(
        doi=doi,
        pmid=pmid,
        title=record.title,
        first_author=_first_author(record.authors),
        pub_date=record.pub_date,
        publication_year=record.publication_year,
    )
    cursor.execute(
        """
        insert into articles (dedup_key, doi, pmid, title, abstract, pub_date)
        values (%s, %s, %s, %s, %s, %s)
        on conflict (dedup_key) do update set
          doi = coalesce(articles.doi, excluded.doi),
          pmid = coalesce(articles.pmid, excluded.pmid),
          abstract = coalesce(articles.abstract, excluded.abstract)
        returning id
        """,
        (dedup_key, doi, pmid, record.title, record.abstract, record.pub_date),
    )
    return cursor.fetchone()[0]


def save_records(connection: Any, strategy_id: int, records: list[LiteratureRecord]) -> SaveStats:
    inserted = 0
    already_seen = 0
    with connection.transaction():
        with connection.cursor() as cursor:
            for record in records:
                if not record.source_uid or not record.title:
                    continue
                cursor.execute(
                    "select id from source_records where source = %s and source_uid = %s",
                    (record.source, record.source_uid),
                )
                if cursor.fetchone():
                    already_seen += 1
                    continue

                article_id = _article_id(cursor, record)
                cursor.execute(
                    """
                    insert into source_records (
                      source, source_uid, strategy_id, doi, title, abstract, journal,
                      pub_date, authors, raw, article_id
                    ) values (
                      %s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s
                    ) on conflict (source, source_uid) do nothing
                    """,
                    (
                        record.source,
                        record.source_uid,
                        strategy_id,
                        normalize_doi(record.doi),
                        record.title,
                        record.abstract,
                        record.journal,
                        record.pub_date,
                        json.dumps(record.authors),
                        json.dumps(record.raw),
                        article_id,
                    ),
                )
                inserted += cursor.rowcount
                already_seen += 1 - cursor.rowcount
    return SaveStats(inserted=inserted, already_seen=already_seen)