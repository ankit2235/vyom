from datetime import date

import pytest

from vyom_literature.ingestion import SweepStats
from vyom_literature.sweep import run_strategy_sweeps
from vyom_literature.system_one import validate_base_url


class FakeClient:
    def __init__(self, records):
        self.records = records
        self.calls = []

    def fetch(self, query, *, from_date, to_date):
        self.calls.append((query, from_date, to_date))
        return self.records


def test_strategy_sweep_fetches_and_ingests_with_versioned_strategy():
    client = FakeClient(["public-record"])
    calls = []

    def fake_screen(records, *, connection, router, strategy_id, system_two_router=None):
        calls.append((records, connection, router, strategy_id, system_two_router))
        return SweepStats(fetched=1, states_created=1, sources_created=1, decisions_created=1)

    import vyom_literature.sweep as sweep

    original = sweep.screen_public_records
    sweep.screen_public_records = fake_screen
    try:
        reports = run_strategy_sweeps(
            [(7, "atorvastatin", "europepmc", {"query": "EXT_ID:10001"})],
            clients={"europepmc": client},
            connection="mock-db",
            router="mock-router",
            from_date=date(2026, 10, 13),
            to_date=date(2026, 10, 14),
        )
    finally:
        sweep.screen_public_records = original

    assert client.calls == [("EXT_ID:10001", date(2026, 10, 13), date(2026, 10, 14))]
    assert calls[0][1:] == ("mock-db", "mock-router", 7, None)
    assert reports[0]["decisions_created"] == 1
    assert reports[0]["target_key"] == "atorvastatin"


def test_missing_strategy_query_fails_before_fetch():
    client = FakeClient([])
    with pytest.raises(ValueError, match="non-empty query"):
        run_strategy_sweeps(
            [(7, "atorvastatin", "europepmc", {})],
            clients={"europepmc": client},
            connection=None,
            router=None,
            from_date=date(2026, 10, 13),
            to_date=date(2026, 10, 14),
        )
    assert client.calls == []


@pytest.mark.parametrize(
    "url",
    [
        "https://typesafe.ai",
        "http://localhost:11434/v1",
        "http://127.0.0.1:11434/v1",
        "http://ollama_sys1:11434/v1",
    ],
)
def test_provider_url_allows_secure_remote_or_approved_local(url):
    validate_base_url(url)


@pytest.mark.parametrize("url", ["http://typesafe.ai", "http://evil.local", "file:///etc/passwd"])
def test_provider_url_rejects_untrusted_plain_http(url):
    with pytest.raises(ValueError, match="HTTPS or an approved local host"):
        validate_base_url(url)