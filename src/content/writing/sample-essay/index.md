---
title: "Sample Essay: LaTeX Math & Version History"
description: "A demonstration of the math rendering and version history features."
date: 2026-01-20
category: tutorials
tags: ["meta", "math"]
draft: false
---

This essay demonstrates the LaTeX math rendering[^1] and version history features.

## Inline Math

You can write inline math using single dollar signs: $E = mc^2$ or $\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$.

## Display Math

For display equations, use double dollar signs:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

Or more complex expressions like the Lagrangian of QED[^2]:

$$
\mathcal{L} = \bar{\psi}(i\gamma^\mu \partial_\mu - m)\psi - \frac{1}{4}F_{\mu\nu}F^{\mu\nu}
$$

[^1]: LaTeX math rendering is powered by KaTeX, a fast math typesetting library.
[^2]: This is the Lagrangian density for Quantum Electrodynamics, combining the Dirac equation for fermions with Maxwell's equations for the electromagnetic field.

## Matrices and Aligned Equations

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

Aligned equations:

$$
\begin{aligned}
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

## Folder-Based Assets

Essays now live in their own folders. You can place images and other assets alongside the markdown file:

```
src/content/essays/
└── my-essay/
    ├── index.md      # Your essay content
    ├── figure1.png   # Referenced as ./figure1.png
    └── data.csv      # Any supporting files
```

## Version History

The commit history appears at the bottom of each essay once it's tracked in your GitHub repository.
