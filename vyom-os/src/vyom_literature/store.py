from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from vyom_literature.screening import PROMPT_VERSION


class PostgresStore:
    def __init__(self, connection: Any):
        self.connection = connection

    def candidates(self, pass_name: str, article_ids: list[int] | None = None) -> list[dict[str, Any]]:
        filters = []
        params: list[Any] = [PROMPT_VERSION]
        if article_ids is not None:
            if not article_ids:
                return []
            filters.append("a.id = any(%s)")
            params.append(article_ids)
        if pass_name == "triage":
            filters.append(
                "not exists (select 1 from screenings sc where sc.article_id = a.id "
                "and sc.pass = 'triage' and sc.prompt_version = %s)"
            )
            params.append(PROMPT_VERSION)
        elif pass_name == "second_look":
            filters.extend(
                [
                    "exists (select 1 from screenings st where st.article_id = a.id "
                    "and st.pass = 'triage' and st.prompt_version = %s and ("
                    "st.verdict <> 'not_case' or st.confidence < 0.95 "
                    "or jsonb_array_length(st.payload->'special_situations') > 0))",
                    "not exists (select 1 from screenings ss where ss.article_id = a.id "
                    "and ss.pass = 'second_look' and ss.prompt_version = %s)",
                ]
            )
            params.extend([PROMPT_VERSION, PROMPT_VERSION])
        else:
            raise ValueError("pass_name must be triage or second_look")

        query = f"""
            select a.id, a.title, a.abstract, a.pub_date
            from articles a
            where exists (
              select 1 from source_records sr
              join search_strategies strategy on strategy.id = sr.strategy_id
              where sr.article_id = a.id and strategy.active
            )
            and {' and '.join(filters)}
            order by a.first_seen_at, a.id
        """
        with self.connection.cursor() as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()
        return [
            {"id": row[0], "title": row[1], "abstract": row[2], "pub_date": row[3]}
            for row in rows
        ]

    def article(self, article_id: int) -> dict[str, Any] | None:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """
                select a.id, a.title, a.abstract, a.pub_date,
                  coalesce(array_agg(distinct strategy.molecule) filter (where strategy.molecule is not null), '{}'),
                  (select s.payload from screenings s where s.article_id = a.id and s.pass = 'triage'
                   order by s.created_at desc limit 1)
                from articles a
                left join source_records sr on sr.article_id = a.id
                left join search_strategies strategy on strategy.id = sr.strategy_id
                where a.id = %s group by a.id
                """,
                (article_id,),
            )
            row = cursor.fetchone()
        if not row:
            return None
        return {
            "id": row[0],
            "title": row[1],
            "abstract": row[2],
            "pub_date": row[3],
            "molecules": row[4],
            "triage_payload": row[5],
        }

    def save_batch_job(
        self,
        *,
        provider_id: str,
        pass_name: str,
        model_id: str,
        prompt_version: str,
        requests: list[Any],
        attempt: int = 1,
    ) -> None:
        custom_ids = [request.custom_id for request in requests]
        with self.connection.transaction():
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    insert into batch_jobs
                      (provider_id, pass, model_id, prompt_version, request_count,
                       custom_ids, attempt, status)
                    values (%s, %s, %s, %s, %s, %s, %s, 'submitted')
                    """,
                    (
                        provider_id,
                        pass_name,
                        model_id,
                        prompt_version,
                        len(custom_ids),
                        custom_ids,
                        attempt,
                    ),
                )

    def pending_batches(self) -> list[dict[str, Any]]:
        with self.connection.cursor() as cursor:
            cursor.execute(
                """
                select provider_id, pass, model_id, prompt_version, custom_ids, attempt, submitted_at
                from batch_jobs where status = 'submitted' order by submitted_at
                """
            )
            rows = cursor.fetchall()
        return [
            {
                "provider_id": row[0],
                "pass_name": row[1],
                "model_id": row[2],
                "prompt_version": row[3],
                "custom_ids": row[4],
                "attempt": row[5],
                "submitted_at": row[6],
            }
            for row in rows
        ]

    def save_screening(
        self,
        *,
        article_id: int,
        pass_name: str,
        model_id: str,
        prompt_version: str,
        rule_version: str,
        batch_id: str,
        payload: dict[str, Any],
    ) -> bool:
        with self.connection.transaction():
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """
                    insert into screenings
                      (article_id, pass, model_id, prompt_version, rule_version,
                       batch_id, verdict, confidence, payload)
                    values (%s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb)
                    on conflict (article_id, pass, prompt_version) do nothing
                    """,
                    (
                        article_id,
                        pass_name,
                        model_id,
                        prompt_version,
                        rule_version,
                        batch_id,
                        payload["verdict"],
                        payload["confidence"],
                        json.dumps(payload),
                    ),
                )
                return cursor.rowcount == 1

    def finish_batch(self, provider_id: str, status: str) -> None:
        if status not in {"ingested", "failed"}:
            raise ValueError("batch terminal status must be ingested or failed")
        with self.connection.transaction():
            with self.connection.cursor() as cursor:
                cursor.execute(
                    "update batch_jobs set status = %s, ingested_at = now() where provider_id = %s",
                    (status, provider_id),
                )


def connect_store(database_url: str) -> PostgresStore:
    import psycopg

    return PostgresStore(psycopg.connect(database_url))