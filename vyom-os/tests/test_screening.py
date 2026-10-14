from copy import deepcopy

import pytest

from vyom_literature.screening import (
    ScreeningValidationError,
    apply_deterministic_rules,
    triage_requires_second_look,
    validate_screening,
)


@pytest.fixture
def screening_payload():
    return {
        "relevant": True,
        "case_criteria": {
            "identifiable_patient": {"present": True, "evidence": "A patient was admitted."},
            "identifiable_reporter": {"present": True, "evidence": "We report a case."},
            "suspect_drug": {"present": True, "evidence": "After starting aspirin."},
            "adverse_event": {"present": True, "evidence": "A patient was admitted."},
        },
        "event_verbatim": "admitted",
        "drug_verbatim": "aspirin",
        "special_situations": [],
        "seriousness": {"serious": True, "criteria": ["hospitalisation"], "evidence": "A patient was admitted."},
        "verdict": "case",
        "confidence": 0.91,
        "uncertainty_reason": None,
    }


def test_unquoted_assertions_are_downgraded_to_absent(screening_payload):
    screening_payload["case_criteria"]["suspect_drug"]["evidence"] = "The patient took aspirin."

    result = validate_screening(screening_payload, "A patient was admitted. We report a case.")

    assert result["case_criteria"]["suspect_drug"] == {"present": False, "evidence": ""}
    assert result["seriousness"]["serious"] is True


def test_unsure_requires_reason(screening_payload):
    screening_payload["verdict"] = "unsure"

    with pytest.raises(ScreeningValidationError, match="uncertainty_reason"):
        validate_screening(screening_payload, "A patient was admitted. We report a case.")


def test_triage_closes_only_confident_negative_without_special_situation(screening_payload):
    payload = deepcopy(screening_payload)
    payload.update(verdict="not_case", confidence=0.95)
    assert not triage_requires_second_look(payload)
    payload["special_situations"] = ["pregnancy"]
    assert triage_requires_second_look(payload)


def test_rule_failures_are_flagged_but_never_drop_candidate(screening_payload):
    outcome = apply_deterministic_rules(
        screening_payload,
        molecule="aspirin",
        title="A case report",
        abstract="A patient was admitted.",
        pub_date=None,
    )

    assert outcome.product_match is False
    assert outcome.queue is True