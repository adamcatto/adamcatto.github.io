# Publication Management Scripts

This directory contains scripts for managing publications from Google Scholar.

## update_publications.py

Fetches publications from Google Scholar and creates/updates markdown files in the publications content collection.

### Features

- Fetches all publications from your Google Scholar profile
- Filters to only include publications from 2019 onwards
- Creates markdown files with proper frontmatter
- Tracks citation counts
- Automatically bolds your name in the author list
- Can update citation counts for existing publications

### Usage

#### First-time setup: Fetch all publications

```bash
# Install dependencies
pip install -r scripts/requirements.txt

# Run the script
python scripts/update_publications.py
```

This will:
- Fetch all publications from 2019 onwards
- Create markdown files for each publication
- Include current citation counts

#### Update citation counts only

```bash
python scripts/update_publications.py --update-citations-only
```

This will:
- Find all existing publications with a `scholarId`
- Update their citation counts
- Skip creating new files

### Automation

A GitHub Action runs weekly (every Sunday at 2 AM UTC) to update citation counts automatically. The workflow can also be triggered manually from the Actions tab.

### Configuration

Edit the constants at the top of `update_publications.py`:

- `SCHOLAR_ID`: Your Google Scholar author ID (currently: `wuJLVSYAAAAJ`)
- `MIN_YEAR`: Minimum publication year to include (currently: 2019)

### Notes

- The script includes a 2-second delay between requests to be respectful to Google Scholar's servers
- Publication titles are sanitized to create safe filenames
- Your name ("Adam Catto") is automatically formatted with `<strong>` tags in the author list
- Long abstracts are truncated to 500 characters
