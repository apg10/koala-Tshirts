# Colombia Auxiliary Node Setup

## Target Hardware

Laptop:
- RTX 2060
- Ryzen 5
- 16 GB RAM

This machine should use smaller local models than Adrian's main node.

## Recommended Model Strategy

### Primary Build Worker
Use:

```powershell
qwen2.5-coder:7b
```

Why:
- strong enough for small code/test edits
- realistic on 16 GB RAM
- likely to use GPU without making the laptop unusable

### Small Repo/Report Model
Use:

```powershell
qwen2.5-coder:3b
```

Why:
- faster and lighter
- good for summaries, git reports, and reading protocol files

### Avoid On This Machine
Avoid as daily drivers:
- 14B+ models
- 20B+ models
- 16k/32k context profiles

They may spill to CPU/RAM and make the laptop too hot or slow.

## Windows Install Checklist

Install:
- Git for Windows
- GitHub CLI
- Python 3.12 or 3.13
- Node.js LTS
- Ollama
- OpenCode

Optional install commands:

```powershell
winget install --id Git.Git -e
winget install --id GitHub.cli -e
winget install --id Python.Python.3.12 -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Ollama.Ollama -e
```

After installation, restart PowerShell.

## GitHub Access

Adrian must invite the Colombia GitHub user as a collaborator:

```powershell
gh repo view apg10/koala-Tshirts --web
```

In GitHub:
- Settings
- Collaborators
- Add people
- permission: write

On the Colombia laptop:

```powershell
gh auth login
git config --global user.name "Colombia Aux"
git config --global user.email "her-email@example.com"
```

Clone:

```powershell
Set-Location "$env:USERPROFILE\Programacion"
git clone https://github.com/apg10/koala-Tshirts.git koala-tshirts
Set-Location "$env:USERPROFILE\Programacion\koala-tshirts"
```

Fetch branches:

```powershell
git fetch origin
```

If the integration branch exists:

```powershell
git switch codex/local-ai-integration
git pull --ff-only origin codex/local-ai-integration
```

If it does not exist yet, ask Adrian to push it first.

## Backend Setup

```powershell
Set-Location "$env:USERPROFILE\Programacion\koala-tshirts\backend"
python -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m pytest tests
```

## Frontend Setup

```powershell
Set-Location "$env:USERPROFILE\Programacion\koala-tshirts\frontend"
npm install
npm.cmd run build
npm.cmd run lint
```

## Ollama Models

Pull:

```powershell
ollama pull qwen2.5-coder:7b
ollama pull qwen2.5-coder:3b
```

Create worker profile:

```powershell
$worker = "$env:USERPROFILE\koala-worker-7b.Modelfile"
@'
FROM qwen2.5-coder:7b
PARAMETER num_ctx 8192
PARAMETER temperature 0.1
PARAMETER top_p 0.9
SYSTEM """
You are a local build worker for the Koala ecommerce repository.
Execute one bounded task only.
Edit only allowed files.
Do not create new files unless explicitly allowed.
Do not commit unless explicitly told to.
Always write the node outbox when required.
Stop after validation.
"""
'@ | Set-Content -Encoding UTF8 $worker
ollama create koala-worker-7b -f $worker
```

Create repo/report profile:

```powershell
$repo = "$env:USERPROFILE\koala-repo-3b.Modelfile"
@'
FROM qwen2.5-coder:3b
PARAMETER num_ctx 8192
PARAMETER temperature 0.0
PARAMETER top_p 0.8
SYSTEM """
You are a repo operator and reporting assistant.
Do not edit application code.
Do not edit tests unless explicitly allowed.
Inspect git status, summarize evidence, update allowed coordination files, and stop.
Never run git add .
Never run destructive git commands.
"""
'@ | Set-Content -Encoding UTF8 $repo
ollama create koala-repo-3b -f $repo
```

Smoke test:

```powershell
ollama run koala-worker-7b "Reply with: koala worker ready"
ollama run koala-repo-3b "Reply with: koala repo ready"
```

## OpenCode Config

```powershell
$path = "$env:USERPROFILE\.config\opencode\opencode.json"
New-Item -ItemType Directory -Force (Split-Path $path) | Out-Null

@'
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "koala-worker-7b": {
          "name": "Koala Worker 7B",
          "variants": {
            "high": {},
            "xhigh": {}
          }
        },
        "koala-repo-3b": {
          "name": "Koala Repo 3B",
          "variants": {
            "high": {}
          }
        }
      }
    }
  },
  "model": "ollama/koala-worker-7b",
  "small_model": "ollama/koala-repo-3b"
}
'@ | Set-Content -Encoding UTF8 $path
```

Run OpenCode:

```powershell
Set-Location "$env:USERPROFILE\Programacion\koala-tshirts"
opencode
```

## Colombia Node Work Rules

Start every task from latest integration:

```powershell
git fetch origin
git switch codex/local-ai-integration
git pull --ff-only origin codex/local-ai-integration
git switch -c codex/colombia/TASK-ID-short-name
```

Only work from a Cloud-approved handoff.

The Colombia worker writes:

```text
coordination/nodes/colombia-aux/QWEN-OUTBOX.md
```

The Colombia repo operator writes:

```text
coordination/nodes/colombia-aux/GPTOSS-REVIEW.md
```

Push after validation:

```powershell
git push -u origin codex/colombia/TASK-ID-short-name
```

Then open a PR into:

```text
codex/local-ai-integration
```

