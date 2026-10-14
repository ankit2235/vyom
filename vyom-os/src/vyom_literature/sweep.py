from __future__ import annotations

import argparse
from datetime import date, timedelta
from typing import Any

from vyom_literature.clients import EuropePMCClient, PubMedClient
from vyom_literature.config import Settings
from vyom_literature.ingestion import screen_public_records
from vyom_literature.system_one import SystemOneRouter
from vyom_literature.system_two import SystemTwoRouter


def _date_argument(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("dates must use YYYY-MM-DD") from error


def _strategy_query(value: Any) -> str:
    query = value.get("query") if isinstance(value, dict) else value
    if not isinstance(query, str) or not query.strip():
        raise ValueError("active public-literature strategy must contain a non-empty query")
    return query


def run_strategy_sweeps(
    strategies: list[tuple[int, str, str, Any]],
    *,
    clients: dict[str, Any],
    connection: Any,
    router: SystemOneRouter,
    from_date: date,
    to_date: date,
    system_two_router: SystemTwoRouter | None = None,
) -> list[dict[str, Any]]:
    reports = []
    for strategy_id, target_key, source, query_or_rules in strategies:
        client = clients.get(source)
        if client is None:
            raise ValueError(f"No fetch client configured for strategy source: {source}")
        records = client.fetch(
            _strategy_query(query_or_rules), from_date=from_date, to_date=to_date
        )
        stats = screen_public_records(
            records,
            connection=connection,
            router=router,
            strategy_id=strategy_id,
            system_two_router=system_two_router,
        )
        reports.append({"strategy_id": strategy_id, "target_key": target_key, **stats.__dict__})
    return reports


def build_environment_sweep(
    *,
    connection: Any,
    router: SystemOneRouter,
    settings: Settings,
    from_date: date,
    to_date: date,
    system_two_router: SystemTwoRouter | None = None,
) -> list[dict[str, Any]]:
    with connection.cursor() as cursor:
        cursor.execute(
            """
            select id, target_key, source, query_or_rules
            from strategies
            where active and domain = 'pv_literature'
              and source in ('pubmed', 'europepmc')
            order by id
            """
        )
        strategies = cursor.fetchall()

    sources = {source for _, _, source, _ in strategies}
    clients = {}
    if "pubmed" in sources:
        clients["pubmed"] = PubMedClient(
            tool=settings.ncbi_tool,
            email=settings.ncbi_email,
            api_key=settings.ncbi_api_key,
        )
    if "europepmc" in sources:
        clients["europepmc"] = EuropePMCClient(
            tool=settings.ncbi_tool,
            email=settings.ncbi_email,
        )
    return run_strategy_sweeps(
        strategies,
        clients=clients,
        connection=connection,
        router=router,
        from_date=from_date,
        to_date=to_date,
        system_two_router=system_two_router,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the v2 public-literature System One sweep")
    parser.add_argument("--from-date", type=_date_argument, default=date.today() - timedelta(days=1))
    parser.add_argument("--to-date", type=_date_argument, default=date.today())
    arguments = parser.parse_args()
    if arguments.from_date > arguments.to_date:
        parser.error("--from-date must be on or before --to-date")

    settings = Settings.from_env()
    try:
        database_url = settings.require_database_url()
        router = SystemOneRouter.from_env()
        system_two_router = SystemTwoRouter.from_env()
    except ValueError as error:
        parser.error(str(error))

    import psycopg

    with psycopg.connect(database_url) as connection:
        reports = build_environment_sweep(
            connection=connection,
            router=router,
            settings=settings,
            from_date=arguments.from_date,
            to_date=arguments.to_date,
            system_two_router=system_two_router,
        )
        for report in reports:
            print(" ".join(f"{key}={value}" for key, value in report.items()))


if __name__ == "__main__":
    main()