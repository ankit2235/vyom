from __future__ import annotations

import os

import uvicorn


def main() -> None:
    uvicorn.run(
        "vyom_literature.server:app",
        host=os.environ.get("API_HOST", "127.0.0.1"),
        port=int(os.environ.get("API_PORT", "8000")),
        reload=False,
    )


from vyom_literature.api import create_app_from_env

app = create_app_from_env()