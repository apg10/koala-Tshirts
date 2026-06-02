#!/usr/bin/env python3
"""Harvest completed local projects into compact chat SFT examples.

The extractor uses Git commits as high-signal completed-work records. It emits
chat-format JSONL rows compatible with the existing Qwen fine-tuning dataset.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


SYSTEM_PROMPT = """source: local-codex-git
You are a disciplined local coding worker learning from completed repository work. Respect the requested scope, modify only relevant files, preserve project conventions, avoid secrets and generated artifacts, report uncertainty honestly, and validate with focused commands."""

DEFAULT_PROJECTS = [
    "noah_app",
    "noah_app_frontend_ui",
    "noah_app_main_merge",
    "ecommerce_local",
    "lazy_software_inc",
    "barbershop",
    "computer_force04",
    "crypto_risk_watcher",
    "perfumes_ecommerce",
    "todo-api-fastapi",
]

SKIP_PATH_PARTS = {
    ".git",
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    ".pytest_cache",
    "dist",
    "build",
    ".next",
    "coverage",
}

SKIP_SUFFIXES = {
    ".pyc",
    ".pyo",
    ".db",
    ".sqlite",
    ".sqlite3",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".pdf",
    ".zip",
}

SECRET_PATTERNS = [
    re.compile(r"(?i)(api[_-]?key|secret|token|password|passwd|private[_-]?key)\s*[:=]\s*['\"][^'\"]{8,}"),
    re.compile(r"(?i)\b(secret_key|django_secret_key)\s*="),
    re.compile(r"(?i)\b(password|token)\s*=\s*[^&\s'\",)]+"),
    re.compile(r"(?i)django-insecure-"),
    re.compile(r"sk_live_[A-Za-z0-9]+"),
    re.compile(r"pk_live_[A-Za-z0-9]+"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
]


@dataclass(frozen=True)
class Project:
    name: str
    root: Path


def run_git(project: Project, args: list[str]) -> str:
    safe = project.root.as_posix()
    command = ["git", "-c", f"safe.directory={safe}", "-C", str(project.root), *args]
    completed = subprocess.run(
        command,
        check=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
    )
    return completed.stdout


def has_bad_path(path: str) -> bool:
    normalized = path.replace("\\", "/")
    parsed = Path(normalized)
    parts = set(parsed.parts)
    return bool(parts & SKIP_PATH_PARTS) or parsed.suffix.lower() in SKIP_SUFFIXES


def has_secret_like_text(text: str) -> bool:
    return any(pattern.search(text) for pattern in SECRET_PATTERNS)


def truncate(text: str, limit: int) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[:limit].rstrip() + "\n...[truncated for training hygiene]"


def list_changed_files(project: Project, commit: str) -> list[str]:
    output = run_git(project, ["show", "--name-only", "--format=", "--no-renames", commit])
    files = [line.strip().replace("\\", "/") for line in output.splitlines() if line.strip()]
    return [path for path in files if not has_bad_path(path)]


def compact_diff(project: Project, commit: str) -> str:
    return run_git(
        project,
        [
            "show",
            "--format=",
            "--no-ext-diff",
            "--unified=3",
            "--no-renames",
            commit,
            "--",
            ":(exclude)node_modules",
            ":(exclude)venv",
            ":(exclude).venv",
            ":(exclude)dist",
            ":(exclude)build",
            ":(exclude).next",
            ":(exclude)coverage",
            ":(exclude)__pycache__",
            ":(exclude)*.pyc",
            ":(exclude)*.pyo",
            ":(exclude)*.db",
            ":(exclude)*.sqlite",
            ":(exclude)*.sqlite3",
            ":(exclude)*.png",
            ":(exclude)*.jpg",
            ":(exclude)*.jpeg",
            ":(exclude)*.gif",
            ":(exclude)*.webp",
            ":(exclude)*.ico",
            ":(exclude)*.pdf",
            ":(exclude)*.zip",
        ],
    )


def commit_subject(project: Project, commit: str) -> str:
    return run_git(project, ["log", "-1", "--format=%s", commit]).strip()


def infer_validation(files: list[str]) -> str:
    joined = "\n".join(files).lower()
    commands: list[str] = []
    if any(path.endswith((".py", ".toml")) for path in files):
        commands.append("run focused Python tests if present")
    if "package.json" in joined or any(path.endswith((".js", ".jsx", ".ts", ".tsx")) for path in files):
        commands.append("run focused frontend tests or build if present")
    if any(path.endswith(".md") for path in files):
        commands.append("review documentation for factual accuracy")
    if not commands:
        commands.append("inspect changed files and run the narrowest available validation")
    return "; ".join(commands)


def row_for_commit(project: Project, commit: str) -> dict[str, object] | None:
    files = list_changed_files(project, commit)
    if not files or len(files) > 24:
        return None

    diff = compact_diff(project, commit)
    if "Binary files " in diff:
        return None
    if not diff.strip() or len(diff) > 35_000 or has_secret_like_text(diff):
        return None

    subject = commit_subject(project, commit)
    allowed = ", ".join(files[:18])
    forbidden = "unrelated files, secrets, generated artifacts, dependency/vendor caches"
    validation = infer_validation(files)
    diff_excerpt = truncate(diff, 12_000)

    user = "\n".join(
        [
            "source: local-codex-git",
            f"Project: {project.name}",
            f"Commit: {commit[:12]}",
            f"Task: {subject}",
            f"Allowed files: {allowed}",
            f"Forbidden files: {forbidden}",
            f"Context: This example is mined from a completed local Codex project commit. Reuse existing project conventions and keep the change scoped to the changed files.",
            f"Expected validation: {validation}",
        ]
    )

    assistant = "\n".join(
        [
            "source: local-codex-git",
            f"Implement the completed change described by the commit: {subject}.",
            f"Keep edits scoped to: {allowed}.",
            f"Validation expectation: {validation}.",
            "",
            "Gold patch excerpt:",
            "```diff",
            diff_excerpt,
            "```",
        ]
    )

    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user},
            {"role": "assistant", "content": assistant},
        ]
    }


def iter_commits(project: Project, limit: int) -> list[str]:
    output = run_git(project, ["log", f"-n{limit}", "--format=%H"])
    return [line.strip() for line in output.splitlines() if line.strip()]


def write_jsonl(path: Path, rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Harvest local Git commits into chat SFT JSONL.")
    parser.add_argument("--projects-root", type=Path, default=Path(r"C:\Users\adria\Programacion\Programacion"))
    parser.add_argument("--out", type=Path, default=Path(r"C:\Users\adria\ai-finetune-qwen\datasets\codex-projects-git-sft.chat.jsonl"))
    parser.add_argument("--report", type=Path, default=Path(r"C:\Users\adria\ai-finetune-qwen\reports\codex-projects-git-harvest.md"))
    parser.add_argument("--commits-per-project", type=int, default=12)
    parser.add_argument("--project", action="append", dest="projects", help="Project directory name to include. Repeatable.")
    args = parser.parse_args()

    names = args.projects or DEFAULT_PROJECTS
    rows: list[dict[str, object]] = []
    report_lines = ["# Codex Projects Git Harvest", ""]

    for name in names:
        project = Project(name=name, root=args.projects_root / name)
        if not (project.root / ".git").exists():
            report_lines.append(f"- `{name}`: skipped, no `.git` directory.")
            continue
        kept = 0
        skipped = 0
        try:
            commits = iter_commits(project, args.commits_per_project)
            for commit in commits:
                row = row_for_commit(project, commit)
                if row is None:
                    skipped += 1
                    continue
                rows.append(row)
                kept += 1
        except subprocess.CalledProcessError as exc:
            report_lines.append(f"- `{name}`: git error: `{exc.stderr.strip()}`")
            continue
        report_lines.append(f"- `{name}`: kept {kept}, skipped {skipped}.")

    write_jsonl(args.out, rows)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text("\n".join(report_lines) + f"\n\nTotal rows: {len(rows)}\n", encoding="utf-8")

    print(f"Wrote {args.out}: {len(rows)} rows")
    print(f"Wrote {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
