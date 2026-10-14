from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from vyom_literature.review import evaluate_gold_decisions, fetch_gold_decisions, fetch_screening_log


def build_weekly_report(
    connection: Any,
    *,
    gold_set_version: str,
    model_id: str,
    sampler_version: str,
    question_schema_version: int,
    threshold_policy_version: int,
    days: int = 7,
) -> dict[str, Any]:
    gold_rows = fetch_gold_decisions(
        connection,
        gold_set_version=gold_set_version,
        model_id=model_id,
        sampler_version=sampler_version,
        question_schema_version=question_schema_version,
        threshold_policy_version=threshold_policy_version,
    )
    return {
        "report_type": "weekly_screening_and_gold_recall",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "window_days": days,
        "versions": {
            "gold_set": gold_set_version,
            "model": model_id,
            "sampler": sampler_version,
            "question_schema": question_schema_version,
            "threshold_policy": threshold_policy_version,
        },
        "screening_log": fetch_screening_log(connection, days=days),
        "gold_evaluation": evaluate_gold_decisions(gold_rows),
        "claim_scope": "Recall metrics use only the specified frozen gold set; pool labels are excluded.",
    }