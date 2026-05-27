# Table of Contents and Footnotes Guide

Your markdown pages now support **automatic table of contents** (left sidebar) and **footnotes**!

## ✨ Features

### Table of Contents (TOC)
- **Desktop (large screens)**: Automatically displayed in the left sidebar
- **Tablet/Mobile**: Available as a collapsible section (if implemented)
- **Active section highlighting**: Current section is highlighted as you scroll
- **Sticky positioning**: TOC stays visible as you scroll
- **Smart filtering**: Shows H2 and H3 headings only

### Footnotes
- **GitHub Flavored Markdown syntax**: Use `[^1]` for references
- **Automatic numbering**: Footnotes are numbered automatically
- **Backlinks**: Click to jump back to the reference in text
- **Styled formatting**: Clean, readable footnote styling

## 📝 How to Use

### Adding Headings (for TOC)

Simply use markdown headings in your content files:

```markdown
---
title: "My Page Title"
description: "Page description"
---

## Main Section

Some content here...

## Another Section

More content...

### Subsection

Detailed information...
```

**The TOC will automatically generate from these headings!**

### Adding Footnotes

Use the GitHub Flavored Markdown footnote syntax:

```markdown
This is some text with a footnote reference.[^1]

Here's another statement that needs a citation.[^2]

[^1]: This is the footnote text that will appear at the bottom.
[^2]: Another footnote with more details.
```

**Example from the Research page:**

```markdown
I currently work on applications of machine learning to neural signal processing,
behavioral neuroscience, and functional genomics.[^1]

[^1]: This work is conducted at the Icahn School of Medicine at Mount Sinai.
```

## 🎨 Layout Behavior

### Desktop (≥ 1280px)
```
┌──────────┬─────────────────┬──────────────┐
│   TOC    │   Main Content  │  (Footnotes) │
│ (left)   │   (center)      │  (right)     │
└──────────┴─────────────────┴──────────────┘
```

### Laptop (≥ 1024px, < 1280px)
```
┌──────────┬─────────────────┐
│   TOC    │   Main Content  │
│ (left)   │   (center)      │
└──────────┴─────────────────┘
```

### Mobile (< 1024px)
```
┌─────────────────────────────┐
│      Main Content           │
│  (TOC collapses to top or   │
│   is hidden on small screens)│
└─────────────────────────────┘
```

## 🔧 Technical Details

### Plugins Installed
- `rehype-slug`: Adds IDs to headings (enables TOC linking)
- `rehype-autolink-headings`: Makes headings clickable
- `remark-gfm`: GitHub Flavored Markdown (enables footnotes)

### Files Modified
- `astro.config.mjs`: Added remark/rehype plugins
- `src/layouts/PageLayout.astro`: New layout with TOC support
- `src/components/TableOfContents.astro`: TOC component
- All page files: Updated to use `PageLayout` and extract `headings`

## 📄 Example Pages

All your static pages now have TOC and footnote support:

- ✅ **About** (`/`) - Home page
- ✅ **Research** (`/research`) - Includes example footnotes
- ✅ **CV** (`/cv`)
- ✅ **Contact** (`/contact`)

## 🎯 Best Practices

### For TOC
1. **Use semantic heading levels**: Start with H2 (`##`), then H3 (`###`)
2. **Keep headings concise**: They appear in the narrow sidebar
3. **Use descriptive text**: Helps users navigate your content
4. **Don't skip levels**: H2 → H3, not H2 → H4

### For Footnotes
1. **Number sequentially**: `[^1]`, `[^2]`, etc.
2. **Define after use**: Place definitions at end of section or page
3. **Keep concise**: Footnotes are for supplementary info
4. **Use for citations**: Perfect for references and sources

## 🧪 Testing

To see the TOC and footnotes in action:

1. **Start dev server**: Already running at `http://localhost:4322/`
2. **Visit Research page**: `/research` has example footnotes
3. **Try different screen sizes**: Resize browser to see responsive layout
4. **Scroll the page**: Watch TOC highlight active sections

## 📚 Adding Footnotes to Other Pages

Update any markdown file in `src/content/pages/`:

```markdown
---
title: "About Me"
description: "Learn more about me"
---

## Background

I work on interesting projects.[^background]

[^background]: More details about my background and experience.
```

That's it! The footnotes will automatically appear at the bottom of the page.

## 🎨 Customization

Want to customize the TOC or footnote styling?

- **TOC styles**: Edit `src/components/TableOfContents.astro`
- **Footnote styles**: Edit `src/layouts/PageLayout.astro` (look for `.footnotes` styles)
- **Layout columns**: Adjust grid template in `PageLayout.astro`

---

**Your pages now have professional table of contents and footnote support!** 🎉
