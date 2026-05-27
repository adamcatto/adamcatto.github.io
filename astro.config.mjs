import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://adamcatto.github.io',
  redirects: {
    '/essays': '/writing',
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
