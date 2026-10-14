from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Protocol

from vyom_literature.screening import (
    PROMPT_VERSION,
    SCREENING_SCHEMA,
    SECOND_LOOK_MODEL,
    SYSTEM_PROMPT,
    TRIAGE_MODEL,
)


@dataclass(frozen=True)
class BatchRequest:
    custom_id: str
    article_id: int
    pass_name: str
    prompt_version: str
    model_id: str
    params: dict[str, Any]


@dataclass(frozen=True)
class CollectedResult:
    custom_id: str
    article_id: int
    pass_name: str
    prompt_version: str
    model_id: str
    payload: dict[str, Any] | None
    error: str | None


class BatchClient(Protocol):
    messages: Any


def custom_id_for(pass_name: str, prompt_version: str, article_id: int) -> str:
    return f"{pass_name}:{prompt_version}:{article_id}"


def build_batch_requests(
    articles: list[dict[str, Any]],
    *,
    pass_name: str,
    first_pass: dict[int, dict[str, Any]] | None = None,
    prompt_version: str = PROMPT_VERSION,
) -> list[BatchRequest]:
    if pass_name not in {"triage", "second_look"}:
        raise ValueError("pass_name must be triage or second_look")
    model_id = TRIAGE_MODEL if pass_name == "triage" else SECOND_LOOK_MODEL
    requests = []
    for article in articles:
        article_id = int(article["id"])
        title = str(article["title"])
        abstract = str(article.get("abstract") or "")
        user_content = f"Title: {title}\n\nAbstract:\n{abstract}"
        if pass_name == "second_look":
            prior = (first_pass or {}).get(article_id)
            if prior is None:
                raise ValueError(f"second_look requires a triage result for article {article_id}")
            user_content += "\n\nTriage output to independently reassess:\n"
            user_content += json.dumps(prior, ensure_ascii=False, sort_keys=True)
        requests.append(
            BatchRequest(
                custom_id=custom_id_for(pass_name, prompt_version, article_id),
                article_id=article_id,
                pass_name=pass_name,
                prompt_version=prompt_version,
                model_id=model_id,
                params={
                    "model": model_id,
                    "max_tokens": 2048,
                    "system": SYSTEM_PROMPT,
                    "output_config": {
                        "format": {"type": "json_schema", "schema": SCREENING_SCHEMA}
                    },
                    "messages": [{"role": "user", "content": user_content}],
                },
            )
        )
    return requests


def submit_batch(client: BatchClient, requests: list[BatchRequest]) -> str:
    if not requests:
        raise ValueError("cannot submit an empty batch")
    from anthropic.types import MessageCreateParamsNonStreaming
    from anthropic.types.messages.batch_create_params import Request

    response = client.messages.batches.create(
        requests=[
            Request(
                custom_id=request.custom_id,
                params=MessageCreateParamsNonStreaming(**request.params),
            )
            for request in requests
        ]
    )
    return response.id


def _parse_custom_id(custom_id: str) -> tuple[str, str, int]:
    try:
        pass_name, prompt_version, article_id = custom_id.split(":", maxsplit=2)
        return pass_name, prompt_version, int(article_id)
    except (ValueError, TypeError) as error:
        raise ValueError(f"invalid batch custom_id: {custom_id}") from error


def _message_payload(message: Any) -> dict[str, Any]:
    content = message.get("content") if isinstance(message, dict) else message.content
    for block in content:
        block_type = block.get("type") if isinstance(block, dict) else block.type
        if block_type != "text":
            continue
        text = block.get("text") if isinstance(block, dict) else block.text
        return json.loads(text)
    raise ValueError("batch response has no structured text output")


def collect_batch(client: BatchClient, provider_id: str) -> tuple[bool, list[CollectedResult]]:
    batch = client.messages.batches.retrieve(provider_id)
    if batch.processing_status != "ended":
        return False, []

    collected = []
    for result in client.messages.batches.results(provider_id):
        pass_name, prompt_version, article_id = _parse_custom_id(result.custom_id)
        model_id = TRIAGE_MODEL if pass_name == "triage" else SECOND_LOOK_MODEL
        if result.result.type != "succeeded":
            collected.append(
                CollectedResult(
                    result.custom_id,
                    article_id,
                    pass_name,
                    prompt_version,
                    model_id,
                    None,
                    result.result.type,
                )
            )
            continue
        try:
            payload = _message_payload(result.result.message)
            collected.append(
                CollectedResult(
                    result.custom_id,
                    article_id,
                    pass_name,
                    prompt_version,
                    model_id,
                    payload,
                    None,
                )
            )
        except (ValueError, TypeError, json.JSONDecodeError) as error:
            collected.append(
                CollectedResult(
                    result.custom_id,
                    article_id,
                    pass_name,
                    prompt_version,
                    model_id,
                    None,
                    f"invalid_output:{error}",
                )
            )
    return True, collected