import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Writing supports folder-based organization: writing/my-piece/index.md
// Assets can be placed alongside: writing/my-piece/figure.png
const writing = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/writing" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      category: z.enum(["essays", "fiction", "reviews", "notes", "tutorials"]).default("essays"),
      tags: z.array(z.string()).default([]),
      // Optional cover image from the same folder
      cover: image().optional(),
    }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    url: z.string().optional(),
    pdf: z.string().optional(),
    description: z.string().optional(),
    citations: z.number().optional(),
    scholarId: z.string().optional(), // Google Scholar citation ID for tracking
    categories: z.array(z.string()).default([]), // e.g., ["neuroscience", "machine-learning", "clinical-informatics"]
    publicationType: z.enum(["journal", "conference", "preprint", "thesis", "other"]).default("other"),
  }),
});

// Projects: folder-based, e.g., projects/my-project/index.md
const projects = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      thumbnail: image().optional(), // Local image from folder
      video: z.string().optional(), // Video URL
      url: z.string().optional(),
      github: z.string().optional(),
      tags: z.array(z.string()).default([]),
      priority: z.number().default(0),
    }),
});

// Software: folder-based, e.g., software/my-lib/index.md
const software = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/software" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      thumbnail: image().optional(),
      video: z.string().optional(),
      url: z.string().optional(),
      github: z.string().optional(),
      docs: z.string().optional(),
      pypi: z.string().optional(),
      npm: z.string().optional(),
      language: z.string().optional(),
      tags: z.array(z.string()).default([]),
      priority: z.number().default(0),
    }),
});

// Apps: folder-based, e.g., apps/my-app/index.md
const apps = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/apps" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      thumbnail: image().optional(), // Local image from folder
      video: z.string().optional(), // YouTube/Vimeo or local video
      url: z.string().optional(),
      github: z.string().optional(),
      appStore: z.string().optional(),
      playStore: z.string().optional(),
      macStore: z.string().optional(),
      windows: z.string().optional(),
      price: z.string().optional(),
      platforms: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      priority: z.number().default(0),
    }),
});

// Pages: single markdown files for static pages like About, CV, Research, Contact
const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { writing, publications, projects, software, apps, pages };
