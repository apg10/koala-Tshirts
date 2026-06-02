# Qwen Fine-Tuning Handoff

This document captures the current fine-tuning setup so a new Codex conversation can continue without reading the full previous thread.

## Goal

Fine-tune or adapter-tune a local Qwen coding model so it behaves better as a repository worker:

- obeys allowed/forbidden file scope
- avoids modifying application code when asked to only inspect or test
- writes factual result packets instead of hallucinated completions
- reports blocked/unsafe tasks instead of inventing fixes
- follows local worker protocol for Codex/OpenCode pipelines

The first target is Qwen 14B. If the pipeline works, consider moving to Qwen 30B later.

## Current Machine

- Windows host with WSL2 Ubuntu
- NVIDIA RTX 5070 Laptop GPU
- GPU visible inside WSL via `nvidia-smi`
- CUDA works in PyTorch
- Python venv exists at:
  - `/home/adria/ai-finetune-qwen/.venv`
- Native WSL project directory:
  - `/home/adria/ai-finetune-qwen`
- Original Windows fine-tune workspace:
  - `C:\Users\adria\ai-finetune-qwen`

## Confirmed Environment State

Inside WSL:

```bash
cd ~/ai-finetune-qwen
source .venv/bin/activate
```

Confirmed:

```text
python --version
Python 3.12.3

pip --version
pip 24.0 from /home/adria/ai-finetune-qwen/.venv/lib/python3.12/site-packages/pip
```

PyTorch CUDA test passed:

```bash
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'no cuda')"
```

Output:

```text
2.11.0+cu128
True
NVIDIA GeForce RTX 5070 Laptop GPU
```

Training libraries imported successfully:

```bash
python -c "import torch, transformers, datasets, accelerate, peft, trl; print('training stack ok')"
```

Output:

```text
training stack ok
```

Installed packages include:

- torch
- torchvision
- torchaudio
- transformers
- datasets
- accelerate
- peft
- trl
- bitsandbytes
- sentencepiece
- protobuf

## Dataset Files

In WSL:

```text
~/ai-finetune-qwen/datasets/final-train.chat.jsonl
~/ai-finetune-qwen/datasets/final-eval.jsonl
```

The files were copied from:

```text
C:\Users\adria\ai-finetune-qwen\datasets
```

Dataset validation passed:

```text
.\datasets\final-train.chat.jsonl -> rows=58 bad=0
.\datasets\final-eval.jsonl -> rows=23 bad=0
```

Row counts:

```text
final-train.chat.jsonl: 58
final-eval.jsonl: 23
```

Dataset format:

```json
{"messages":[{"role":"system","content":"..."},{"role":"user","content":"..."},{"role":"assistant","content":"..."}]}
```

Dataset read test passed:

```bash
python - <<'PY'
from datasets import load_dataset

ds = load_dataset("json", data_files="datasets/final-train.chat.jsonl", split="train")
print("rows:", len(ds))
print("columns:", ds.column_names)
print("first keys:", ds[0].keys())
print("first message roles:", [m["role"] for m in ds[0]["messages"]])
print("first user preview:", ds[0]["messages"][1]["content"][:300])
PY
```

Output:

```text
rows: 58
columns: ['messages']
first keys: dict_keys(['messages'])
first message roles: ['system', 'user', 'assistant']
```

## Tokenizer Test

Tokenizer test passed using:

```text
unsloth/Qwen3-14B-unsloth-bnb-4bit
```

Command:

```bash
python - <<'PY'
from datasets import load_dataset
from transformers import AutoTokenizer

model_id = "unsloth/Qwen3-14B-unsloth-bnb-4bit"

ds = load_dataset("json", data_files="datasets/final-train.chat.jsonl", split="train")
tok = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)

text = tok.apply_chat_template(
    ds[0]["messages"],
    tokenize=False,
    add_generation_prompt=False,
)

print("formatted chars:", len(text))
print(text[:1000])
PY
```

Output:

```text
formatted chars: 2474
```

The rendered prompt begins with:

```text
<|im_start|>system
You are a strict local coding worker operating inside a repository.
...
<|im_start|>user
Instruction:
...
```

## Current Next Step

The next step is the model loading test. It was suggested but not yet confirmed complete.

Run this in WSL:

```bash
cd ~/ai-finetune-qwen
source .venv/bin/activate

python - <<'PY'
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

model_id = "unsloth/Qwen3-14B-unsloth-bnb-4bit"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

tok = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True,
)

print("model loaded")
print("cuda:", torch.cuda.is_available())
print("device:", next(model.parameters()).device)
print("max memory allocated GB:", round(torch.cuda.max_memory_allocated() / 1024**3, 2))
PY
```

Expected success output includes:

```text
model loaded
cuda: True
```

If this fails with CUDA memory errors, do not continue to training yet. Options:

1. Try shorter sequence length.
2. Try smaller batch and gradient accumulation.
3. Try Qwen 7B first to validate the full pipeline.
4. Use Colab/cloud for Qwen 14B training.

## Important Caution

The RTX 5070 Laptop GPU has limited VRAM. Qwen 14B QLoRA may be tight even in 4-bit. The first goal is not a perfect final model; it is to prove the pipeline:

1. load model
2. load dataset
3. run a tiny LoRA training pass
4. save adapter
5. run a before/after eval task

Only after this works should we scale examples, context length, epochs, or target Qwen 30B.

## Dataset Provenance

The dataset combines:

- Noah Food examples from a production-grade Django/DRF SaaS project
- Koala T-shirts examples from the local Codex/OpenCode pipeline
- rejection cases for scope, tenant risk, secret risk, and unsafe migrations
- behavior cases from local-model failures/successes

The training goal is mostly behavioral discipline, not teaching syntax.

## User Preference

The user wants step-by-step guidance, not a giant wall of instructions.

Use short phases:

1. run one command
2. inspect output
3. decide next step

Do not dump the entire training pipeline at once unless requested.

