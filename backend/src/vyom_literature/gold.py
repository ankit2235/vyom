from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable
from uuid import UUID


class GoldSetConflictError(ValueError):
    pass


@dataclass(frozen=True)
class GoldSetImportStats:
    imported: int
    already_present: int


def import_gold_labels(
    connection: Any,
    *,
    rows: Iterable[dict[str, Any]],
    gold_set_version: str,
    adjudicator_id: UUID,
) -> GoldSetImportStats:
    if not gold_set_version.strip():
        raise ValueError("gold_set_version is required")

    imported = already_present = 0
    seen_state_ids: set[int] = set()
    with connection.transaction():
        with connection.cursor() as cursor:
            for row in rows:
                state_id = int(row["state_id"])
                if state_id in seen_state_ids:
                    raise ValueError(f"duplicate state_id in input: {state_id}")
                seen_state_ids.add(state_id)
                is_valid_case = row["is_valid_case"]
                if isinstance(is_valid_case, str):
                    normalized = is_valid_case.strip().lower()
                    if normalized not in {"true", "false", "1", "0", "yes", "no"}:
                        raise ValueError(f"invalid is_valid_case for state {state_id}")
                    is_valid_case = normalized in {"true", "1", "yes"}
                if not isinstance(is_valid_case, bool):
                    raise ValueError(f"invalid is_valid_case for state {state_id}")
                rationale = str(row.get("rationale_note") or "").strip()
                if not rationale:
                    raise ValueError(f"rationale_note is required for state {state_id}")

                cursor.execute(
                    "select domain from clinical_states where id = %s",
                    (state_id,),
                )
                state_row = cursor.fetchone()
                if state_row is None:
                    raise ValueError(f"unknown clinical state: {state_id}")
                if state_row[0] != "pv_literature":
                    raise ValueError("gold recall set currently accepts public PV literature only")

                cursor.execute(
                    """
                    insert into gold_set_labels (
                      state_id, gold_set_version, is_valid_case, adjudicator_id, rationale_note
                    ) values (%s, %s, %s, %s, %s)
                    on conflict (state_id, gold_set_version) do nothing
                    returning id
                    """,
                    (state_id, gold_set_version, is_valid_case, str(adjudicator_id), rationale),
                )
                if cursor.fetchone() is not None:
                    imported += 1
                    continue

                cursor.execute(
                    """
                    select is_valid_case, adjudicator_id, rationale_note
                    from gold_set_labels where state_id = %s and gold_set_version = %s
                    """,
                    (state_id, gold_set_version),
                )
                existing = cursor.fetchone()
                if (
                    existing is None
                    or bool(existing[0]) != is_valid_case
                    or str(existing[1]) != str(adjudicator_id)
                    or existing[2] != rationale
                ):
                    raise GoldSetConflictError(
                        f"gold label conflicts for state {state_id} in version {gold_set_version}"
                    )
                already_present += 1
    return GoldSetImportStats(imported=imported, already_present=already_present)


def load_gold_csv(path: str | Path) -> list[dict[str, str]]:
    with Path(path).open(newline="", encoding="utf-8-sig") as source:
        reader = csv.DictReader(source)
        required = {"state_id", "is_valid_case", "rationale_note"}
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            raise ValueError("CSV must contain state_id,is_valid_case,rationale_note columns")
        return list(reader)