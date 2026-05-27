---
title: "AlphaGEmmaNOME"
description: "A Gemma-powered genomic copilot that calls AlphaGenome, renders epigenomic tracks, designs genome edits, and fine-tunes the agent locally."
tags: ["genomics", "LLM", "agent", "AlphaGenome", "Gemma", "LangGraph", "fine-tuning"]
priority: 20
videos:
  - src: ./AlphaGEmmaNOME.mp4
    title: "Track prediction, genome editing, and visualization"
  - src: ./AlphaGEmmaNOME-dpo-pane.mp4
    title: "Page showing samples generated for RLHF-based post-training"
---

AlphaGEmmaNOME is an interactive functional-genomics chat application. A local **Gemma-4-4B**  model (served with Ollama) orchestrates calls to **AlphaGenome** (`alphagenome-pytorch`, 450M parameters) to predict regulatory signals—TF binding, chromatin accessibility, histone marks, RNA expression, splicing, and 3D contacts—and returns ranked results with interactive visualizations. Beyond read-only prediction, the system includes an **inverse genome-editing engine** that searches SNVs, deletions, insertions, and motif edits to maximize, minimize, or target specific regulatory signals.

The stack is a four-process architecture: Ollama for the LLM, an AlphaGenome microservice for RNA-seq / epigenomic track predictions and edit optimization, a LangGraph agent backend streaming over SSE, and a React frontend split one-third chat / two-thirds visualization.

## System architecture

When a user sends a message, the agent backend runs a LangGraph state machine:

```
START → intent_router
          ├─ "answer"  → conversational → END
          └─ "predict" → agent ⇄ tools (ReAct loop) → synthesizer → END
```

An **intent router** classifies each message as a knowledge question (answered directly by the LLM) or a prediction task (routed into the tool-calling loop). For predictions, the **agent node** binds tools to `ChatOllama` and iterates until the model produces a final answer. A **synthesizer** collects visualization specs from tool outputs and streams them to the frontend alongside token-level chat and tool-call events.

AlphaGenome runs as a separate FastAPI service that holds model weights and prediction tensors server-side. The frontend fetches downsampled track arrays over the session API rather than shipping raw tensors to the browser. Sessions persist chat history, uploaded FASTA sequences, and cached predictions for follow-up questions and edit comparisons.

## Tool calling

Small models struggle with long multi-step plans, so AlphaGEmmaNOME uses a **macro-first** tool design: each enabled tool runs a complete workflow in one call rather than chaining many low-level primitives.

Enabled macros cover the main genomics workflows:

- **Gene-centric analysis** — TF binding, expression (RNA-seq, CAGE, PRO-cap), arbitrary track heads, splicing, and tissue-differential regulation
- **Region-centric analysis** — regulatory landscapes at `chrN:start-end`, large tiled regions
- **Variant analysis** — HGVS SNV effect scoring, ClinVar lookup with optional AlphaGenome scoring
- **External databases** — GWAS Catalog, ENCODE regulatory elements, GTEx expression
- **Design** — CRISPR guide design near a gene TSS
- **Inverse design** — `optimize_edits` searches SNVs (beam-search ISM), deletions, motif insertions/ablations, and insertions to hit a target regulatory signal

The `optimize_edits` solver scores edits by log2 fold-change against a no-edit baseline, using the mean of center bins at the edit site. Objectives include maximize, minimize, or target a specific signal level.

Tools also wrap Ensembl, gnomAD, UCSC conservation, and JASPAR motif scanning. The agent system prompt enforces one workflow tool per prediction question and requires citing numbers from tool output rather than inventing them.

## Visualizations

The frontend renders **viz specs** emitted by the agent as the prediction completes. The primary view is an canvas **track viewer** that plots epigenomic signals (TF ChIP in purple, ATAC in orange, etc.) with genomic coordinate ticks, drag-to-zoom, and hover readouts. An **IGV.js** toggle provides a genome-browser fallback for users who prefer it.

For genome editing, the track viewer overlays a **reference vs. edited** comparison: the baseline prediction and the post-edit prediction appear on the same axes, with the edited trace shown as a dashed overlay—useful for inspecting how a proposed SNV or deletion shifts a TF binding peak.

Additional viz types are defined for contact maps (Plotly heatmap) and splice junction arcs; contact maps and variant-delta panels are still being wired to live backend data. The chat pane streams agent thoughts, tool-call logs, and supports thumbs-up/down feedback plus inline corrections for alignment data collection.

## Fine-tuning

AlphaGEmmaNOME closes the loop between usage and model improvement. Thumbs-up/down responses and inline edits on agent steps are stored as **DPO preference pairs** and **SFT correction examples**. An auto-RL generator can synthesize training trajectories by posing genomics challenges to the agent and scoring answers against an AlphaGenome oracle.

Training uses **QLoRA** on `google/gemma-4-E4B-it`:

| Stage | Method | Details |
|-------|--------|---------|
| SFT | `trl.SFTTrainer` | 4-bit NF4 quantization, LoRA r=8 α=16 on attention/MLP |
| DPO | `trl.DPOTrainer` | Same LoRA config, β=0.1, frozen reference model |
| Deploy | Ollama | Merge adapters → `ollama create gemma-4-omnigenomanome` |

The Alignment Portal in the UI exposes DPO/SFT counts, a trajectory inspector, and JSONL export. After training, the fine-tuned model replaces the base Ollama model and the agent picks it up on the next session.

## Tech stack

Python 3.11+ (FastAPI, LangGraph, LangChain, PyTorch), React + TypeScript (Vite, Zustand, canvas, IGV.js, Plotly), Ollama, HuggingFace Transformers + PEFT + trl, and Docker Compose for deployment.
