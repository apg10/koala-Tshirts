#!/usr/bin/env python3
"""Build a compact high-value booster dataset for same-day Qwen training."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


DEFAULT_DATASETS = Path(r"C:\Users\adria\ai-finetune-qwen\datasets")


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8-sig") as handle:
        for line_no, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            value = json.loads(line)
            if not isinstance(value, dict):
                raise ValueError(f"{path}:{line_no} is not a JSON object")
            rows.append(value)
    return rows


def validate_chat(row: dict[str, Any], label: str) -> None:
    messages = row.get("messages")
    if not isinstance(messages, list) or len(messages) != 3:
        raise ValueError(f"{label}: expected 3 messages")
    roles = [message.get("role") if isinstance(message, dict) else None for message in messages]
    if roles != ["system", "user", "assistant"]:
        raise ValueError(f"{label}: unexpected roles {roles}")
    for message in messages:
        if not isinstance(message.get("content"), str) or not message["content"].strip():
            raise ValueError(f"{label}: empty content")


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")


def pick(rows: list[dict[str, Any]], indices: list[int], label: str) -> list[dict[str, Any]]:
    selected: list[dict[str, Any]] = []
    for index in indices:
        row = rows[index - 1]
        validate_chat(row, f"{label}:{index}")
        selected.append(row)
    return selected


def main() -> int:
    parser = argparse.ArgumentParser(description="Build high-priority Noah/Qwen booster dataset.")
    parser.add_argument("--datasets-dir", type=Path, default=DEFAULT_DATASETS)
    parser.add_argument("--out", default="final-train.priority-noah-backend-tonight.chat.jsonl")
    args = parser.parse_args()

    harvested = args.datasets_dir / "harvested"
    backend = harvested / "noah_backend_patterns"
    noah = harvested / "noah_app"

    rows: list[dict[str, Any]] = []

    # All backend syntax rows are high value for the next pass.
    rows.extend(read_jsonl(backend / "backend-patterns.chat.jsonl"))
    rows.extend(read_jsonl(backend / "backend-antipatterns.chat.jsonl"))

    # Highest-signal operational Noah rows: auth/session, ownership, probes, idempotency.
    noah_sft = read_jsonl(noah / "sft.chat.jsonl")
    rows.extend(pick(noah_sft, [2, 3, 4, 5, 7, 9, 10, 11], "noah_app/sft"))

    # Highest-signal stop cases: secrets, live data, client ownership, false validation.
    noah_rejection = read_jsonl(noah / "rejection.chat.jsonl")
    rows.extend(pick(noah_rejection, [1, 2, 4, 5], "noah_app/rejection"))

    # Highest-signal review cases: false report, probe leak, weak throttling.
    noah_review = read_jsonl(noah / "review.chat.jsonl")
    rows.extend(pick(noah_review, [2, 3, 4], "noah_app/review"))

    for index, row in enumerate(rows, start=1):
        validate_chat(row, f"booster:{index}")

    out_path = args.datasets_dir / args.out
    write_jsonl(out_path, rows)

    print(f"backend patterns: 12")
    print(f"backend antipatterns: 8")
    print(f"noah sft priority: 8")
    print(f"noah rejection priority: 4")
    print(f"noah review priority: 3")
    print(f"total rows: {len(rows)}")
    print(f"wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
