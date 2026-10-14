from __future__ import annotations

import argparse
import json
from pathlib import Path

from vyom_literature.config import Settings
from vyom_literature.reporting import build_weekly_report


def main() -> None:
    parser = argparse.ArgumentParser(description="Write the weekly screening and gold recall report")
    parser.add_argument("--gold-set-version", required=True)
    parser.add_argument("--model-id", required=True)
    parser.add_argument("--sampler-version", required=True)
    parser.add_argument("--question-schema-version", required=True, type=int)
    parser.add_argument("--threshold-policy-version", required=True, type=int)
    parser.add_argument("--days", default=7, type=int)
    parser.add_argument("--output", default="weekly-report.json")
    arguments = parser.parse_args()
    if not 1 <= arguments.days <= 366:
        parser.error("--days must be between 1 and 366")

    try:
        database_url = Settings.from_env().require_database_url()
    except ValueError as error:
        parser.error(str(error))

    import psycopg

    with psycopg.connect(database_url) as connection:
        report = build_weekly_report(
            connection,
            gold_set_version=arguments.gold_set_version,
            model_id=arguments.model_id,
            sampler_version=arguments.sampler_version,
            question_schema_version=arguments.question_schema_version,
            threshold_policy_version=arguments.threshold_policy_version,
            days=arguments.days,
        )
    Path(arguments.output).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"report_written={arguments.output}")


if __name__ == "__main__":
    main()