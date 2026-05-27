# Editing Pages as Markdown

All your site pages can now be edited as markdown files in the `src/content/pages/` directory!

## ✨ New Features

- **Table of Contents**: Automatically generated from headings (H2/H3)
- **Footnotes**: GitHub Flavored Markdown footnote support
- **Responsive Layout**: TOC on left sidebar (desktop), footnotes styled inline

See `TOC_AND_FOOTNOTES_GUIDE.md` for detailed usage instructions.

## Current Page Structure

Your site now has the following editable markdown pages:

- **About** (`src/content/pages/about.md`) → renders at `/` (home page)
- **Research** (`src/content/pages/research.md`) → renders at `/research`
- **CV** (`src/content/pages/cv.md`) → renders at `/cv`
- **Contact** (`src/content/pages/contact.md`) → renders at `/contact`

## How It Works

1. **Content Configuration** (`src/content.config.ts`)
   - Added a new `pages` collection that loads markdown files from `src/content/pages/`
   - Each page requires `title` and optional `description` in frontmatter

2. **Page Templates** (`src/pages/*.astro`)
   - Updated to use `PageLayout` which includes TOC and footnotes support
   - They now use `getEntry()` to load content from markdown
   - They extract `headings` from rendered content for TOC generation
   - They render the markdown using the `<Content />` component

## Adding a New Page

To add a new static page (e.g., "Books"):

1. **Create the markdown file**: `src/content/pages/books.md`
   ```markdown
   ---
   title: "Books"
   description: "Books I'm reading or recommend"
   ---

   ## Currently Reading

   - Book title by Author
   - Another book by Another Author

   ## Recommendations

   My favorite books include...
   ```

2. **Create the Astro page**: `src/pages/books.astro`
   ```astro
   ---
   import PageLayout from "../layouts/PageLayout.astro";
   import { getEntry, render } from "astro:content";

   const page = await getEntry("pages", "books");
   if (!page) {
     throw new Error("Books page not found in content/pages/books.md");
   }
   const { Content, headings } = await render(page);
   ---

   <PageLayout title={page.data.title} description={page.data.description} headings={headings}>
     <h1>{page.data.title}</h1>
     <Content />
   </PageLayout>
   ```

3. **Add to navigation** (if needed in your nav component)

## Markdown Features

You can use standard markdown in your page files:

- **Headers**: `## Section Title` (automatically added to TOC)
- **Links**: `[Link Text](https://example.com)`
- **Lists**: Bullet points with `-` or numbered with `1.`
- **Emphasis**: `*italic*` or `**bold**`
- **Footnotes**: `[^1]` for reference, `[^1]: Text` for definition
- **HTML**: You can mix in HTML for complex formatting (like the CV download button)
- **Math**: Use LaTeX syntax with `$inline$` or `$$block$$`

## Benefits

✅ **Easy Editing**: Just edit markdown files in `content/pages/`
✅ **Type Safety**: Content schema validation via Zod
✅ **Consistent**: Same pattern as essays, projects, publications
✅ **Version Control**: Track changes to content in git
✅ **Separation**: Content separated from presentation logic
✅ **Table of Contents**: Auto-generated from headings
✅ **Footnotes**: Full GitHub Flavored Markdown support
✅ **Responsive**: TOC appears in sidebar on larger screens

## Example Edit

To update your research interests, just edit `src/content/pages/research.md`:

```markdown
---
title: "Research"
description: "My research interests and future directions"
---

I currently work on...

- New research area 1
- New research area 2
```

Then rebuild: `npm run build` or `npm run dev`

That's it! No need to touch `.astro` files anymore for content updates.
