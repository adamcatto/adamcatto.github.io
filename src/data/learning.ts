// Technical learning: courses, lecture series, and technical books.
// Active is what I'm working through now; past is grouped by area, newest first.

const goodreads = (id: string) => `https://www.goodreads.com/book/show/${id}`;

export type LearningKind = "Course" | "Lecture series" | "Book" | "Degree";

export interface LearningItem {
  kind: LearningKind;
  title: string;
  by: string; // instructors, author, or institution
  url?: string;
  when?: string; // a term or year
  note?: string;
}

export const active: LearningItem[] = [
  {
    kind: "Course",
    title: "11-768 AI Agents",
    by: "Carnegie Mellon · Graham Neubig & Daniel Fried",
    url: "https://www.cmu-agents.com/",
    when: "Fall 2026",
    note: "Building an agent scaffold from scratch, designing evals for multi-step tasks, and training agentic LLMs with RL.",
  },
  {
    kind: "Course",
    title: "CS336 Language Modeling from Scratch",
    by: "Stanford · Percy Liang & Tatsunori Hashimoto",
    url: "https://cs336.stanford.edu/",
    when: "Fall 2026",
    note: "The full pipeline, built by hand: tokenization, transformers, training, scaling laws, data, and alignment.",
  },
  {
    kind: "Lecture series",
    title: "Post-training course & The RLHF Book",
    by: "Nathan Lambert",
    url: "https://rlhfbook.com/",
    when: "Fall 2026",
    note: "Lectures on YouTube that follow the book chapter by chapter: reward models, RL math and implementation, DPO, reasoning models, and synthetic data.",
  },
  {
    kind: "Book",
    title: "AI Engineering",
    by: "Chip Huyen",
    url: goodreads("216848047"),
    when: "Fall 2026",
    note: "Building applications on foundation models: evaluation, prompting, RAG, agents, finetuning, and inference optimization.",
  },
];

export const past: { area: string; items: LearningItem[] }[] = [
  {
    area: "Machine learning",
    items: [
      { kind: "Book", title: "Machine Learning Yearning", by: "Andrew Ng", url: goodreads("30741739"), when: "2024" },
      { kind: "Degree", title: "M.S. in Data Science", by: "CUNY Graduate Center", when: "2022" },
      { kind: "Book", title: "Interpretable Machine Learning", by: "Christoph Molnar", url: goodreads("37843167"), when: "2021" },
      { kind: "Book", title: "Deep Learning for Vision Systems", by: "Mohamed Elgendy", url: goodreads("50542108"), when: "2020" },
      { kind: "Book", title: "The Elements of Statistical Learning", by: "Hastie, Tibshirani & Friedman", url: goodreads("148009") },
    ],
  },
  {
    area: "Signals, imaging & sensing",
    items: [
      { kind: "Book", title: "Sensors: An Introductory Course", by: "Kourosh Kalantar-zadeh", url: goodreads("15877436"), when: "2022" },
      { kind: "Book", title: "Conceptual Wavelets in Digital Signal Processing", by: "D. Lee Fugal", url: goodreads("13088291"), when: "2021" },
      { kind: "Book", title: "Digital Image Processing", by: "Rafael C. Gonzalez & Richard E. Woods", url: goodreads("196018"), when: "2021" },
    ],
  },
  {
    area: "Neuroscience",
    items: [
      { kind: "Book", title: "Molecular Neuropharmacology", by: "Eric J. Nestler et al.", url: goodreads("2398583"), when: "2025" },
    ],
  },
  {
    area: "Math, logic & computation",
    items: [
      { kind: "Degree", title: "B.S. in Applied Mathematics & Statistics, Philosophy", by: "Stony Brook University", when: "2019" },
      { kind: "Book", title: "Computability: Turing, Gödel, Church, and Beyond", by: "B. Jack Copeland et al.", url: goodreads("16248641"), when: "2017" },
      { kind: "Book", title: "Linear Algebra Done Right", by: "Sheldon Axler", url: goodreads("309768") },
      { kind: "Book", title: "Applied Combinatorics", by: "Alan Tucker", url: goodreads("593615") },
      { kind: "Book", title: "Logics for Computer Science", by: "Anita Wasilewska", url: goodreads("44433198") },
      { kind: "Book", title: "Algorithmic Information Theory", by: "Gregory Chaitin", url: goodreads("852501") },
    ],
  },
];
