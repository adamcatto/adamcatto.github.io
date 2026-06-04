---
title: "SAM3-WebTracker"
description: "A full-stack web app for interactive video instance segmentation and tracking on Meta's SAM 3, with a downstream pipeline for quantifying animal behavior from tracked masks."
tags: ["computer-vision", "SAM3", "video-segmentation", "object-tracking", "behavioral-neuroscience", "FastAPI", "React", "full-stack"]
thumbnail: ./sample_sam3_webtracker_screenshot.png
priority: 19
---

I work in a behavioral neuroscience lab. We need to track mice in different behavior assay contexts, across millions of video frames for any given experimental run, often with multiple mice. I created "SAM3-WebTracker" to do this whole-mouse-body tracking (i.e. video instance segmentation) robustly, with a smooth video annotation experience; the platform extends to arbitrary types of videos of arbitrary length.

SAM3-WebTracker is a browser-based tool for segmenting and tracking multiple objects across long videos, built on Meta's **SAM 3** (Segment Anything Model 3). You point-click to annotate objects on a single frame, then propagate the masks across thousands of frames. It is designed for research workflows that need precise, frame-by-frame object masks—in particular, tracking individual animals in behavioral neuroscience experiments—and ships with a downstream pipeline that turns tracked masks into quantitative behavioral metrics.

The system has three layers: a **web application** (React frontend + FastAPI backend) for interactive annotation and propagation, a **SQLite mask store** for efficient frame-level persistence, and a **downstream analysis** package for animal behavior analysis, since I created this system to track rodent behavior; it does locomotion quantification, behavioral feature extraction, clustering, and multi-experiment statistical comparison.

## Annotation and tracking

A user creates a project, uploads or imports videos, and adds named objects (e.g. "Mouse A", "Mouse B"). Clicking on a frame places positive/negative point prompts; the backend runs SAM inference and returns base64-encoded RGBA mask overlays rendered on a canvas in real time, so predictions appear instantly and can be refined with additional points.

Once a few anchor frames are annotated, "Track Objects" propagates masks across the whole video. The frontend opens a **Server-Sent Events** connection; the backend extracts frames in 1000-frame mini-batches, runs SAM propagation per batch, writes compressed masks to the SQLite database, and streams progress events back. The last frame's masks from batch *N* seed batch *N+1*, preserving object identity across batches for videos with tens of thousands of frames. Propagation can be paused and resumed, and frames where tracking drifts can be re-annotated.

## Architecture

```
        Browser (React + Zustand)
              |  Vite proxy /api/*
        FastAPI (server.py)
        /                  \
   SAMPredictor         ProjectManager
   (sam3 / sam2)        (config.json)
        |                    |
   pretrained_models/   ~/.sam3_zero_projects/<uuid>/
                          videos/<vid>/{source.mp4, masks.sqlite, frames/}
```

The FastAPI backend exposes 60+ endpoints grouped into projects, videos, sessions, annotation, propagation, masks, and export. It streams source video with HTTP 206 range requests for smooth seeking, applies MP4 faststart optimization on import, and extracts frames on demand rather than decompressing entire videos up front. SAM 3 loads as the primary model, with automatic fallback to **SAM 2.1 Large** behind a shared inference API. Masks are stored with COCO RLE compression in SQLite.

The frontend is React 18 + TypeScript + Vite with Tailwind, using Zustand for global state and a typed Axios client. Key pieces include a frame viewer that swaps between JPEG frames (paused) and an HTML5 `<video>` element (playback) under a canvas mask overlay, a click-to-annotate canvas that converts to normalized coordinates, and a timeline with per-object propagation progress.

## Downstream behavioral analysis

Since the web app was built for behavioral neuroscience applications, it also includes a custom rodent-behavior-specific behavior quantification package. The `downstream_analysis` package runs independently of the web app and converts tracked masks into behavioral metrics. A locomotion pipeline computes centroid path-length in sliding windows and fits bimodal Gaussian Mixture Models to separate stationary vs. mobile sub-sequences. A clustering pipeline extracts a 33-dimensional behavioral feature vector per sliding window—per-object kinematics (energy, speed, angular velocity, area dynamics, eccentricity) plus pairwise interaction features (approach/retreat rate, chase metric and lag, proximity, relative heading, overlap)—then builds a k-NN graph and runs **Leiden community detection** with UMAP embedding to recover behavioral motifs.

A multi-project pipeline merges interaction data across experiments, applies **ComBat** batch correction, and runs cross-condition statistical tests (Fisher's exact, Mann-Whitney U, Wilcoxon signed-rank). An identity registry maps each video to specific animals, roles, and housing conditions, supporting structured comparisons across habituation, resident-intruder, and locomotion experiment designs. Feature extraction parallelizes across videos as LSF (`bsub`) jobs for HPC, and tracking propagation itself can be fanned out across multiple GPUs.

## Tech stack

Python 3.10+ (FastAPI, OpenCV, PyTorch, SAM 3 / SAM 2.1, SQLite, scanpy/leidenalg, UMAP, ComBat), React 18 + TypeScript (Vite, Zustand, Tailwind, canvas, Axios, SSE), and LSF-based HPC batch processing. Built on SAM 3 by Meta AI Research (Apache 2.0).
