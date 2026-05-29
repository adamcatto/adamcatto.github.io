---
title: "AI-Neuroscientist"
description: "An autonomous research agent that plans and executes bioinformatics analyses on spatial and single-cell transcriptomics data, writing and running its own notebook code against a live kernel."
github: "https://github.com/adamcatto/AI-Neuroscientist"
tags: ["LLM", "agent", "bioinformatics", "single-cell", "spatial-transcriptomics", "scanpy", "Ollama"]
priority: 15
---

AI-Neuroscientist is an experimental autonomous research agent for bioinformatics. Given a high-level research objective and a folder of `.h5ad` data files, the agent plans and executes a full analysis of spatial and single-cell transcriptomics data—decomposing the objective into ordered subtasks, generating markdown explanations and executable code cells, running those cells against a live IPython kernel, self-correcting on errors, and persisting all outputs to a Jupyter notebook.

The agent is driven by a local LLM (DeepSeek-r1:70b served via Ollama) and relies on `scanpy` and `anndata` for the underlying analysis. The approach is pure prompt engineering and orchestration—no fine-tuning.

## Architecture

The codebase is modularized into orchestration logic (`main.py`), LLM querying (`query.py`), prompt templates, robust text parsing, notebook manipulation via `nbformat`, and a code-debugging agent that implements two error-recovery strategies.

## Status

The project is in a research/experimental phase, documented as a sequence of trials (0000–0005) with post-mortems. Planning works adequately; autonomous coding remains the bottleneck. Identified next steps include RAG over library documentation and adoption of a dedicated multi-agent framework.
