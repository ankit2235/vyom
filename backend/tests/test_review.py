from contextlib import contextmanager
from uuid import UUID

import pytest

from vyom_literature.review import (
    append_review_label,
    evaluate_gold_decisions,
    fetch_review_queue,
    wilson_interval,
)


class FakeConnection:
    def __init__(self, decision_exists=True):
        self.decision_exists = decision_exists
        self.queries = []
        self.labels = []

    @contextmanager
    def transaction(self):
        yield

    @contextmanager
    def cursor(self):
        yield FakeCursor(self)


class FakeCursor:
    def __init__(self, connection):
        self.connection = connection
        self.row = None

    def execute(self, query, params):
        self.connection.queries.append((query, params))
        normalized = " ".join(query.lower().split())
        if normalized.startswith("select 1 from sys1_decisions"):
            self.row = (1,) if self.connection.decision_exists else None
        elif normalized.startswith("insert into human_labels"):
            self.connection.labels.append(params)
            self.row = (9,)
        elif "with latest_decision as" in normalized:
            self.row = None
        else:
            raise AssertionError(f"Unexpected query: {query}")

    def fetchone(self):
        return self.row

    def fetchall(self):
        return []


def test_correction_requires_patch_and_escalation_cannot_assert_truth():
    connection = FakeConnection()
    common = {
        "state_id": 1,
        "decision_id": 2,
        "reviewer_id": UUID("12345678-1234-5678-1234-567812345678"),
        "reviewer_role": "pv_associate",
    }
    with pytest.raises(ValueError, match="override_patch"):
        append_review_label(connection, **common, action="CORRECT")
    with pytest.raises(ValueError, match="cannot assert"):
        append_review_label(connection, **common, action="ESCALATE", override_patch={"valid": True})
    assert connection.labels == []


def test_review_label_requires_matching_decision_and_is_always_pool():
    connection = FakeConnection(decision_exists=False)
    with pytest.raises(ValueError, match="does not belong"):
        append_review_label(
            connection,
            state_id=1,
            decision_id=2,
            reviewer_id=UUID("12345678-1234-5678-1234-567812345678"),
            reviewer_role="safety_physician",
            action="ACCEPT",
        )

    connection.decision_exists = True
    label_id = append_review_label(
        connection,
        state_id=1,
        decision_id=2,
        reviewer_id=UUID("12345678-1234-5678-1234-567812345678"),
        reviewer_role="safety_physician",
        action="CORRECT",
        override_patch={"has_adverse_event": "NO"},
        event_verbatim="rash",
    )

    assert label_id == 9
    insert_query, params = connection.queries[-1]
    assert "'pool'" in insert_query
    assert params[4] == "CORRECT"


def test_review_queue_validates_domain_and_limit():
    connection = FakeConnection()
    with pytest.raises(ValueError, match="unsupported review domain"):
        fetch_review_queue(connection, domain="unknown")
    with pytest.raises(ValueError, match="limit"):
        fetch_review_queue(connection, limit=500)

    assert fetch_review_queue(connection, domain="pv_literature", limit=10) == []
    assert connection.queries[-1][1] == ("pv_literature", 10)


def test_gold_evaluation_counts_only_explicit_gold_labels_and_lists_misses():
    result = evaluate_gold_decisions(
        [
            {"state_id": 1, "title_or_header": "Missed case", "model_id": "m", "confidence_band": "GREEN_CLOSE", "is_valid_case": True},
            {"state_id": 2, "title_or_header": "Flagged case", "model_id": "m", "confidence_band": "RED_ESCALATE", "is_valid_case": True},
            {"state_id": 3, "title_or_header": "False alarm", "model_id": "m", "confidence_band": "YELLOW_REVIEW", "is_valid_case": False},
            {"state_id": 4, "title_or_header": "Correct close", "model_id": "m", "confidence_band": "GREEN_CLOSE", "is_valid_case": False},
        ]
    )

    assert (result["tp"], result["fp"], result["fn"], result["tn"]) == (1, 1, 1, 1)
    assert result["recall"] == 0.5
    assert result["recall_95_ci"] is not None
    assert result["misses"][0]["state_id"] == 1


def test_wilson_interval_is_none_without_positive_gold_count():
    assert wilson_interval(0, 0) is None