#!/usr/bin/env python3
"""Merge harvested per-project chat datasets into an existing train JSONL."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


DEFAULT_TRAIN_FILES = ("sft.chat.jsonl", "rejection.chat.jsonl", "review.chat.jsonl")


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    if not path.exists():
        return rows
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
        raise ValueError(f"{label}: expected exactly 3 messages")
    roles = [message.get("role") if isinstance(message, dict) else None for message in messages]
    if roles != ["system", "user", "assistant"]:
        raise ValueError(f"{label}: unexpected roles {roles}")
    for message in messages:
        if not isinstance(message.get("content"), str) or not message["content"].strip():
            raise ValueError(f"{label}: empty message content")


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")


def fingerprint(row: dict[str, Any]) -> str:
    return json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Merge harvested project training rows.")
    parser.add_argument("--datasets-dir", type=Path, default=Path(r"C:\Users\adria\ai-finetune-qwen\datasets"))
    parser.add_argument("--base", default="final-train.with-codex-projects.chat.jsonl")
    parser.add_argument("--project", required=True, help="Harvested project folder name under datasets/harvested/")
    parser.add_argument("--out", required=True, help="Output JSONL filename under datasets/")
    parser.add_argument("--train-file", action="append", dest="train_files", help="Training JSONL filename inside the harvested project folder. Repeatable.")
    args = parser.parse_args()

    base_rows = read_jsonl(args.datasets_dir / args.base)
    harvest_dir = args.datasets_dir / "harvested" / args.project

    rows: list[dict[str, Any]] = []
    seen: set[str] = set()
    duplicates = 0
    counts: dict[str, int] = {}

    for index, row in enumerate(base_rows, start=1):
        validate_chat(row, f"{args.base}:{index}")
        key = fingerprint(row)
        seen.add(key)
        rows.append(row)

    train_files = tuple(args.train_files or DEFAULT_TRAIN_FILES)
    for filename in train_files:
        file_rows = read_jsonl(harvest_dir / filename)
        counts[filename] = len(file_rows)
        for index, row in enumerate(file_rows, start=1):
            validate_chat(row, f"{filename}:{index}")
            key = fingerprint(row)
            if key in seen:
                duplicates += 1
                continue
            seen.add(key)
            rows.append(row)

    out_path = args.datasets_dir / args.out
    write_jsonl(out_path, rows)

    print(f"base rows: {len(base_rows)}")
    for filename, count in counts.items():
        print(f"{filename}: {count}")
    print(f"duplicates skipped: {duplicates}")
    print(f"merged rows: {len(rows)}")
    print(f"wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
