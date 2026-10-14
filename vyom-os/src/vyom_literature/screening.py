from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date
from typing import Any


TRIAGE_MODEL = "claude-haiku-5-5"
SECOND_LOOK_MODEL = "claude-sonnet-5-5"
PROMPT_VERSION = "screen/v1"
RULE_VERSION = "rules/2026.10"
CONFIDENT_NO_THRESHOLD = 0.95
CONFIDENCE_FLOOR = 0.50

CRITERIA = (
    "identifiable_patient",
    "identifiable_reporter",
    "suspect_drug",
    "adverse_event",
)
SPECIAL_SITUATIONS = (
    "pregnancy",
    "overdose",
    "misuse",
    "off_label",
    "lack_of_efficacy",
    "medication_error",
)
SERIOUSNESS_CRITERIA = (
    "death",
    "life_threatening",
    "hospitalisation",
    "disability",
    "congenital_anomaly",
    "medically_important",
)

SCREENING_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "relevant": {"type": "boolean"},
        "case_criteria": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                criterion: {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "present": {"type": "boolean"},
                        "evidence": {"type": "string"},
                    },
                    "required": ["present", "evidence"],
                }
                for criterion in CRITERIA
            },
            "required": list(CRITERIA),
        },
        "event_verbatim": {"type": "string"},
        "drug_verbatim": {"type": "string"},
        "special_situations": {
            "type": "array",
            "items": {"type": "string", "enum": list(SPECIAL_SITUATIONS)},
        },
        "seriousness": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "serious": {"type": "boolean"},
                "criteria": {
                    "type": "array",
                    "items": {"type": "string", "enum": list(SERIOUSNESS_CRITERIA)},
                },
                "evidence": {"type": "string"},
            },
            "required": ["serious", "criteria", "evidence"],
        },
        "verdict": {"type": "string", "enum": ["case", "not_case", "unsure"]},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "uncertainty_reason": {"type": ["string", "null"]},
    },
    "required": [
        "relevant",
        "case_criteria",
        "event_verbatim",
        "drug_verbatim",
        "special_situations",
        "seriousness",
        "verdict",
        "confidence",
        "uncertainty_reason",
    ],
}

SYSTEM_PROMPT = """You screen public literature abstracts for individual safety cases.
Only use information explicitly present in the supplied title and abstract.
For every positive case criterion and seriousness criterion, quote a sentence
verbatim from the abstract. If no exact sentence supports a criterion, set
present to false and evidence to an empty string. Do not infer patient details.
Keep event_verbatim and drug_verbatim in the article's own wording; do not code
or normalize medical terms. Return only the requested structured fields.
"""


class ScreeningValidationError(ValueError):
    pass


def _normalise_whitespace(value: str) -> str:
    return " ".join(value.split())


def _require_mapping(value: Any, field: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ScreeningValidationError(f"{field} must be an object")
    return value


def _quoted_in_abstract(quote: str, abstract: str) -> bool:
    normalized_quote = _normalise_whitespace(quote)
    normalized_abstract = _normalise_whitespace(abstract)
    return bool(normalized_quote) and normalized_quote.casefold() in normalized_abstract.casefold()


def validate_screening(payload: dict[str, Any], abstract: str) -> dict[str, Any]:
    result = dict(payload)
    criteria = _require_mapping(result.get("case_criteria"), "case_criteria")
    normalized_criteria = {}
    for criterion in CRITERIA:
        item = _require_mapping(criteria.get(criterion), f"case_criteria.{criterion}")
        present = item.get("present")
        evidence = item.get("evidence")
        if not isinstance(present, bool) or not isinstance(evidence, str):
            raise ScreeningValidationError(f"case_criteria.{criterion} has invalid fields")
        if present and not _quoted_in_abstract(evidence, abstract):
            present, evidence = False, ""
        normalized_criteria[criterion] = {"present": present, "evidence": evidence}
    result["case_criteria"] = normalized_criteria

    seriousness = _require_mapping(result.get("seriousness"), "seriousness")
    serious_evidence = seriousness.get("evidence")
    if not isinstance(serious_evidence, str):
        raise ScreeningValidationError("seriousness.evidence must be a string")
    if serious_evidence and not _quoted_in_abstract(serious_evidence, abstract):
        seriousness = {**seriousness, "evidence": "", "serious": False, "criteria": []}
    result["seriousness"] = seriousness

    verdict = result.get("verdict")
    if verdict not in {"case", "not_case", "unsure"}:
        raise ScreeningValidationError("verdict must be case, not_case, or unsure")
    if verdict == "unsure" and not result.get("uncertainty_reason"):
        raise ScreeningValidationError("unsure verdict requires uncertainty_reason")
    try:
        confidence = float(result.get("confidence"))
    except (TypeError, ValueError) as error:
        raise ScreeningValidationError("confidence must be numeric") from error
    if not 0 <= confidence <= 1:
        raise ScreeningValidationError("confidence must be between 0 and 1")
    result["confidence"] = confidence
    if not isinstance(result.get("special_situations"), list):
        raise ScreeningValidationError("special_situations must be a list")
    if not isinstance(result.get("relevant"), bool):
        raise ScreeningValidationError("relevant must be a boolean")
    for field in ("event_verbatim", "drug_verbatim"):
        if not isinstance(result.get(field), str):
            raise ScreeningValidationError(f"{field} must be a string")
    return result


def triage_requires_second_look(payload: dict[str, Any]) -> bool:
    confident_no = (
        payload["verdict"] == "not_case"
        and payload["confidence"] >= CONFIDENT_NO_THRESHOLD
        and not payload["special_situations"]
    )
    return not confident_no


@dataclass(frozen=True)
class RuleOutcomes:
    product_match: bool
    date_sane: bool
    confidence_adequate: bool
    queue: bool

    def as_dict(self) -> dict[str, bool]:
        return {
            "product_match": self.product_match,
            "date_sane": self.date_sane,
            "confidence_adequate": self.confidence_adequate,
            "queue": self.queue,
        }


def apply_deterministic_rules(
    payload: dict[str, Any], *, molecule: str, title: str, abstract: str, pub_date: date | None
) -> RuleOutcomes:
    product = re.sub(r"\W+", " ", molecule.casefold()).strip()
    document = re.sub(r"\W+", " ", f"{title} {abstract}".casefold())
    product_match = bool(product and re.search(rf"\b{re.escape(product)}\b", document))
    date_sane = pub_date is None or pub_date <= date.today()
    confidence_adequate = payload["confidence"] >= CONFIDENCE_FLOOR
    # Rule failures remain visible to a human; they never discard candidate cases.
    return RuleOutcomes(
        product_match=product_match,
        date_sane=date_sane,
        confidence_adequate=confidence_adequate,
        queue=True,
    )