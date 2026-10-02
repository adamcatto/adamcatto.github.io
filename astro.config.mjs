import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import pagefind from 'astro-pagefind';

// Staging builds set SITE_BASE=/new-version; production builds at the root.
const base = process.env.SITE_BASE || '';

export default defineConfig({
  site: 'https://adamcatto.github.io',
  base: base || '/',
  redirects: {
    // Static redirect destinations aren't base-prefixed by Astro, so do it here.
    // (The dynamic one resolves against the route itself and must stay unprefixed.)
    '/essays': `${base}/writing`,
    '/essays/[...slug]': '/writing/[...slug]',
  },
  integrations: [mdx(), pagefind()],
  markdown: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
