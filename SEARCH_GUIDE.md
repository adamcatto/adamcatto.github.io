# Site-Wide Search with Pagefind

Your personal site now has a powerful site-wide search feature using Pagefind.

## Features

- **Fast Static Search**: No external services required, all search happens client-side
- **Keyboard Shortcut**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open search
- **Search Button**: Click the "Search" button in the header navigation
- **Indexes Everything**: Searches across all content:
  - Publications
  - Essays
  - Projects
  - Software
  - Apps
  - Pages (About, Research, CV, etc.)

## How It Works

### Build-Time Indexing
Pagefind runs automatically during `npm run build` and:
1. Crawls all generated HTML pages
2. Creates a search index in `/dist/pagefind/`
3. Indexes page content, headings, and metadata

### Search UI
- **Location**: Header navigation (top right)
- **Modal Dialog**: Opens a clean search modal overlay
- **Real-Time Results**: Updates as you type
- **Result Previews**: Shows excerpts with highlighted matches

## Usage

### Open Search
- Click the "Search" button in header
- Or press `Cmd+K` / `Ctrl+K`

### Search Tips
- Type any keyword or phrase
- Results update instantly as you type
- Click a result to navigate to that page
- Press `Escape` or click outside to close

## Customization

### Search Component
Located at: `src/components/Search.astro`

You can customize:
- **Appearance**: Modify Tailwind classes for styling
- **Behavior**: Adjust search options in the PagefindUI initialization
- **Results**: Configure `excerptLength`, `showImages`, `showSubResults`

### Indexed Content
Pagefind automatically indexes:
- All text content in `<main>` tags
- Page titles and headings
- Metadata from frontmatter

### Exclude Content from Search
To exclude specific content, add `data-pagefind-ignore` attribute:
```html
<div data-pagefind-ignore>
  This content won't be searchable
</div>
```

## Configuration

### Pagefind Options
Edit `astro.config.mjs` to customize Pagefind behavior:
```javascript
integrations: [
  mdx(),
  pagefind({
    // Custom options here
  })
]
```

Available options:
- `site` - Override site URL
- `bundle` - Custom bundle directory
- `force_language` - Set language explicitly

## Categories in Search

The search automatically indexes categories from your publications and other content. When you search, results include:
- Publication categories (neuroscience, machine-learning, clinical-informatics)
- Content from all sections of your site
- Metadata like authors, years, and descriptions

## Performance

- **Index Size**: ~300KB for typical site
- **Search Speed**: < 50ms for most queries
- **No Server Required**: All processing happens in browser
- **Works Offline**: Once loaded, search works without internet

## Maintenance

The search index is automatically rebuilt every time you run `npm run build`. No manual maintenance required!

When you:
- Add new publications (via the Python script)
- Write new essays
- Update projects or software

The search will automatically include them on the next build.
