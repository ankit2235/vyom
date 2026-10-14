from __future__ import annotations

import argparse
import os
from uuid import UUID

from vyom_literature.config import Settings
from vyom_literature.gold import import_gold_labels, load_gold_csv


def main() -> None:
    parser = argparse.ArgumentParser(description="Import a frozen public-PV gold-label CSV")
    parser.add_argument("csv_path")
    parser.add_argument("--version", required=True, help="Immutable gold-set version identifier")
    parser.add_argument("--adjudicator-id", required=True, type=UUID)
    arguments = parser.parse_args()

    try:
        database_url = Settings.from_env().require_database_url()
        rows = load_gold_csv(arguments.csv_path)
    except ValueError as error:
        parser.error(str(error))

    import psycopg

    with psycopg.connect(database_url) as connection:
        stats = import_gold_labels(
            connection,
            rows=rows,
            gold_set_version=arguments.version,
            adjudicator_id=arguments.adjudicator_id,
        )
    print(f"gold_set={arguments.version} imported={stats.imported} already_present={stats.already_present}")


if __name__ == "__main__":
    main()