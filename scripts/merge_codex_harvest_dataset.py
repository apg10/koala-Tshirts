#!/usr/bin/env python3
"""Merge the existing final train chat dataset with the local Codex harvest."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, start=1):
            if not line.strip():
                continue
            value = json.loads(line)
            if not isinstance(value, dict):
                raise ValueError(f"{path}:{line_no} is not a JSON object")
            rows.append(value)
    return rows


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")


def fingerprint(row: dict[str, Any]) -> str:
    return json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


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


def main() -> int:
    parser = argparse.ArgumentParser(description="Merge final training data with Codex project harvest.")
    parser.add_argument("--datasets-dir", type=Path, default=Path(r"C:\Users\adria\ai-finetune-qwen\datasets"))
    parser.add_argument("--base", default="final-train.chat.jsonl")
    parser.add_argument("--harvest", default="codex-projects-git-sft.chat.jsonl")
    parser.add_argument("--out", default="final-train.with-codex-projects.chat.jsonl")
    args = parser.parse_args()

    base_path = args.datasets_dir / args.base
    harvest_path = args.datasets_dir / args.harvest
    out_path = args.datasets_dir / args.out

    base_rows = read_jsonl(base_path)
    harvest_rows = read_jsonl(harvest_path)

    merged: list[dict[str, Any]] = []
    seen: set[str] = set()
    duplicates = 0

    for source_name, rows in (("base", base_rows), ("harvest", harvest_rows)):
        for index, row in enumerate(rows, start=1):
            validate_chat(row, f"{source_name}:{index}")
            key = fingerprint(row)
            if key in seen:
                duplicates += 1
                continue
            seen.add(key)
            merged.append(row)

    write_jsonl(out_path, merged)

    print(f"base rows: {len(base_rows)}")
    print(f"harvest rows: {len(harvest_rows)}")
    print(f"duplicates skipped: {duplicates}")
    print(f"merged rows: {len(merged)}")
    print(f"wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
