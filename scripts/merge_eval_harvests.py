#!/usr/bin/env python3
"""Merge held-out eval JSONL rows with harvested project evals."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


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


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Merge held-out eval rows.")
    parser.add_argument("--datasets-dir", type=Path, default=Path(r"C:\Users\adria\ai-finetune-qwen\datasets"))
    parser.add_argument("--base", default="final-eval.jsonl")
    parser.add_argument("--project", required=True)
    parser.add_argument("--harvest-eval", default="eval.jsonl")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    rows = read_jsonl(args.datasets_dir / args.base)
    harvested = read_jsonl(args.datasets_dir / "harvested" / args.project / args.harvest_eval)

    seen_ids = {str(row.get("id")) for row in rows}
    added = 0
    for row in harvested:
        if not row.get("id") or not row.get("prompt"):
            raise ValueError(f"invalid eval row: {row}")
        row_id = str(row["id"])
        if row_id in seen_ids:
            continue
        rows.append(row)
        seen_ids.add(row_id)
        added += 1

    out_path = args.datasets_dir / args.out
    write_jsonl(out_path, rows)
    print(f"base eval rows: {len(rows) - added}")
    print(f"harvest eval added: {added}")
    print(f"merged eval rows: {len(rows)}")
    print(f"wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
