import json
from types import SimpleNamespace

import pytest

from vyom_literature.batches import (
    build_batch_requests,
    collect_batch,
    custom_id_for,
)


def test_batch_requests_pin_model_and_custom_id():
    [request] = build_batch_requests(
        [{"id": 12, "title": "Report", "abstract": "Public abstract."}],
        pass_name="triage",
    )

    assert request.custom_id == "triage:screen/v1:12"
    assert request.model_id == "claude-haiku-5-5"
    assert request.params["output_config"]["format"]["type"] == "json_schema"


def test_second_look_includes_first_pass_result():
    [request] = build_batch_requests(
        [{"id": 12, "title": "Report", "abstract": "Public abstract."}],
        pass_name="second_look",
        first_pass={12: {"verdict": "unsure"}},
    )

    assert request.model_id == "claude-sonnet-5-5"
    assert '"verdict": "unsure"' in request.params["messages"][0]["content"]


def test_second_look_rejects_missing_triage_result():
    with pytest.raises(ValueError, match="requires a triage result"):
        build_batch_requests(
            [{"id": 12, "title": "Report", "abstract": "Text"}], pass_name="second_look"
        )


class FakeBatchAPI:
    def __init__(self, status, results):
        self.status = status
        self.batch_results = results

    def retrieve(self, provider_id):
        return SimpleNamespace(processing_status=self.status)

    def results(self, provider_id):
        return iter(self.batch_results)


def _result(custom_id, result_type, payload=None):
    message = SimpleNamespace(content=[SimpleNamespace(type="text", text=json.dumps(payload))])
    return SimpleNamespace(
        custom_id=custom_id,
        result=SimpleNamespace(type=result_type, message=message if payload is not None else None),
    )


def test_collect_maps_out_of_order_results_by_custom_id():
    client = SimpleNamespace(
        messages=SimpleNamespace(
            batches=FakeBatchAPI(
                "ended",
                [
                    _result("triage:screen/v1:2", "succeeded", {"verdict": "unsure"}),
                    _result("triage:screen/v1:1", "errored"),
                ],
            )
        )
    )

    ended, results = collect_batch(client, "batch-1")

    assert ended is True
    assert [result.article_id for result in results] == [2, 1]
    assert results[0].payload == {"verdict": "unsure"}
    assert results[1].error == "errored"


def test_collect_returns_without_consuming_unfinished_batch():
    client = SimpleNamespace(messages=SimpleNamespace(batches=FakeBatchAPI("in_progress", [])))

    ended, results = collect_batch(client, "batch-1")

    assert ended is False
    assert results == []


def test_custom_id_is_unambiguous():
    assert custom_id_for("triage", "screen/v2", 99) == "triage:screen/v2:99"