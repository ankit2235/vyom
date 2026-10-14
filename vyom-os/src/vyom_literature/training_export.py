from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _training_record(row: tuple[Any, ...]) -> list[dict[str, Any]]:
    label_id, state_id, state_hash, model_id, sampler_version, schema_version, policy_version, state, answers, overrides, rationale = row
    if isinstance(state, str):
        state = json.loads(state)
    if isinstance(answers, str):
        answers = json.loads(answers)
    if isinstance(overrides, str):
        overrides = json.loads(overrides)
    if not isinstance(overrides, dict) or not overrides:
        return []

    output = []
    for question_id, gold_answer in overrides.items():
        if question_id not in answers:
            continue
        output.append(
            {
                "id": f"pool-{label_id}-{question_id}",
                "domain": "pv_literature",
                "state_sha256": state_hash,
                "question_id": question_id,
                "messages": [
                    {
                        "role": "system",
                        "content": "Classify the public literature state using the specified question. Return only the allowed answer.",
                    },
                    {
                        "role": "user",
                        "content": json.dumps(
                            {"state": state, "question_id": question_id},
                            ensure_ascii=False,
                            sort_keys=True,
                        ),
                    },
                    {"role": "assistant", "content": str(gold_answer)},
                ],
                "metadata": {
                    "source_label_id": label_id,
                    "source_state_id": state_id,
                    "previous_model_id": model_id,
                    "previous_sampler_version": sampler_version,
                    "question_schema_version": schema_version,
                    "threshold_policy_version": policy_version,
                    "reviewer_rationale": rationale or "",
                    "exported_at": datetime.now(timezone.utc).isoformat(),
                },
            }
        )
    return output


def export_public_pool_corrections(connection: Any, *, days: int = 7) -> Path:
    if os.environ.get("ENABLE_TRAINING_EXPORT") != "true":
        raise RuntimeError("Set ENABLE_TRAINING_EXPORT=true only on the approved local training host")
    if not 1 <= days <= 90:
        raise ValueError("days must be between 1 and 90")
    export_dir = Path(os.environ.get("TRAINING_EXPORT_DIR", "./local-training-exports")).resolve()
    export_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    output_path = export_dir / f"pv-pool-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.jsonl"

    with connection.cursor() as cursor:
        cursor.execute(
            """
            select label.id, state.id, decision.state_sha256,
                   decision.model_id, decision.sampler_version,
                   decision.question_schema_version, decision.threshold_policy_version,
                   state.normalized_state, decision.answers, label.override_patch,
                   label.rationale_note
            from human_labels label
            join clinical_states state on state.id = label.state_id
            join sys1_decisions decision on decision.id = label.sys1_decision_id
            where label.action = 'CORRECT'
              and label.split = 'pool'
              and state.domain = 'pv_literature'
              and label.created_at >= now() - (%s * interval '1 day')
              and not exists (
                select 1 from gold_set_labels gold where gold.state_id = state.id
              )
            order by label.created_at, label.id
            """,
            (days,),
        )
        rows = cursor.fetchall()

    file_descriptor = os.open(output_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(file_descriptor, "w", encoding="utf-8") as output:
        for row in rows:
            for record in _training_record(row):
                output.write(json.dumps(record, ensure_ascii=False) + "\n")
    return output_path


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Export local-only public PV pool corrections for offline evaluation/training")
    parser.add_argument("--days", type=int, default=7)
    arguments = parser.parse_args()

    from vyom_literature.config import Settings

    try:
        database_url = Settings.from_env().require_database_url()
    except ValueError as error:
        parser.error(str(error))
    import psycopg

    with psycopg.connect(database_url) as connection:
        path = export_public_pool_corrections(connection, days=arguments.days)
    print(f"training_export={path}")


if __name__ == "__main__":
    main()