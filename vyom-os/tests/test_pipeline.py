from datetime import datetime, timedelta, timezone

from vyom_literature.batches import CollectedResult
from vyom_literature.pipeline import collect_ready, submit_pass


def _payload(verdict="case", confidence=0.8):
    sentence = "A patient developed a rash after starting aspirin."
    return {
        "relevant": True,
        "case_criteria": {
            "identifiable_patient": {"present": True, "evidence": sentence},
            "identifiable_reporter": {"present": False, "evidence": ""},
            "suspect_drug": {"present": True, "evidence": sentence},
            "adverse_event": {"present": True, "evidence": sentence},
        },
        "event_verbatim": "rash",
        "drug_verbatim": "aspirin",
        "special_situations": [],
        "seriousness": {"serious": False, "criteria": [], "evidence": ""},
        "verdict": verdict,
        "confidence": confidence,
        "uncertainty_reason": "Needs review" if verdict == "unsure" else None,
    }


class FakeStore:
    def __init__(self):
        self.articles = {
            1: {
                "id": 1,
                "title": "Aspirin adverse event",
                "abstract": "A patient developed a rash after starting aspirin.",
                "pub_date": None,
                "molecules": ["aspirin"],
                "triage_payload": None,
            }
        }
        self.saved = []
        self.jobs = []
        self.finished = []

    def candidates(self, pass_name, article_ids=None):
        ids = article_ids if article_ids is not None else list(self.articles)
        return [self.articles[article_id] for article_id in ids if article_id in self.articles]

    def article(self, article_id):
        return self.articles.get(article_id)

    def save_batch_job(self, **kwargs):
        self.jobs.append(
            {
                **kwargs,
                "custom_ids": [request.custom_id for request in kwargs["requests"]],
                "submitted_at": datetime.now(timezone.utc),
            }
        )

    def pending_batches(self):
        return [job for job in self.jobs if job["provider_id"] not in self.finished]

    def save_screening(self, **kwargs):
        self.saved.append(kwargs)
        if kwargs["pass_name"] == "triage":
            self.articles[kwargs["article_id"]]["triage_payload"] = kwargs["payload"]
        return True

    def finish_batch(self, provider_id, status):
        self.finished.append(provider_id)


class FakeProvider:
    def __init__(self):
        self.submitted = []
        self.collections = {}

    def submit(self, requests):
        self.submitted.append(requests)
        return f"batch-{len(self.submitted)}"

    def collect(self, provider_id):
        return self.collections.get(provider_id, (False, []))


def test_triage_result_submits_second_look_batch_with_prior_payload():
    store = FakeStore()
    provider = FakeProvider()
    submit_pass(store, provider, "triage")
    provider.collections["batch-1"] = (
        True,
        [CollectedResult("triage:screen/v1:1", 1, "triage", "screen/v1", "claude-haiku-5-5", _payload(), None)],
    )

    stats = collect_ready(store, provider)

    assert stats["ingested"] == 1
    assert stats["second_look_submitted"] == 1
    assert provider.submitted[1][0].model_id == "claude-sonnet-5-5"
    assert '"verdict": "case"' in provider.submitted[1][0].params["messages"][0]["content"]


def test_missing_results_are_retried_with_bounded_attempts():
    store = FakeStore()
    provider = FakeProvider()
    submit_pass(store, provider, "triage")
    provider.collections["batch-1"] = (True, [])

    stats = collect_ready(store, provider)

    assert stats["retried"] == 1
    assert len(provider.submitted) == 2
    assert store.jobs[1]["attempt"] == 2


def test_unfinished_recent_batch_is_not_blocked_or_retried():
    store = FakeStore()
    provider = FakeProvider()
    submit_pass(store, provider, "triage")
    stats = collect_ready(store, provider, now=datetime.now(timezone.utc) + timedelta(hours=1))

    assert stats["waiting"] == 1
    assert len(provider.submitted) == 1