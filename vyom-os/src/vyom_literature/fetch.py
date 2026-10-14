from __future__ import annotations

import argparse
from datetime import date, timedelta

from vyom_literature.clients import EuropePMCClient, PubMedClient
from vyom_literature.config import Settings
from vyom_literature.repository import save_records


def _date_argument(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("dates must use YYYY-MM-DD") from error


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch public literature for active strategies")
    parser.add_argument("--from-date", type=_date_argument, default=date.today() - timedelta(days=1))
    parser.add_argument("--to-date", type=_date_argument, default=date.today())
    arguments = parser.parse_args()
    if arguments.from_date > arguments.to_date:
        parser.error("--from-date must be on or before --to-date")

    settings = Settings.from_env()
    try:
        database_url = settings.require_database_url()
    except ValueError as error:
        parser.error(str(error))

    import psycopg
    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "select id, source, query from search_strategies where active order by id"
            )
            strategies = cursor.fetchall()

        if any(source == "pubmed" for _, source, _ in strategies):
            pubmed = PubMedClient(
                tool=settings.ncbi_tool,
                email=settings.ncbi_email,
                api_key=settings.ncbi_api_key,
            )
        else:
            pubmed = None
        europepmc = EuropePMCClient(
            tool=settings.ncbi_tool, email=settings.ncbi_email
        )

        for strategy_id, source, query in strategies:
            if source == "pubmed":
                if pubmed is None:
                    raise RuntimeError("PubMed client was not configured")
                records = pubmed.fetch(
                    query, from_date=arguments.from_date, to_date=arguments.to_date
                )
            else:
                records = europepmc.fetch(
                    query, from_date=arguments.from_date, to_date=arguments.to_date
                )
            stats = save_records(connection, strategy_id, records)
            print(
                f"strategy={strategy_id} source={source} "
                f"fetched={len(records)} inserted={stats.inserted} already_seen={stats.already_seen}"
            )


if __name__ == "__main__":
    main()