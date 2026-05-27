#!/usr/bin/env python3
"""
Fetch publications from Google Scholar and update the publications content collection.
Only includes publications from 2019 onwards.
"""

import os
import re
import sys
from pathlib import Path
from scholarly import scholarly
import time

# Configuration
SCHOLAR_ID = "wuJLVSYAAAAJ"
MIN_YEAR = 2019
PUBLICATIONS_DIR = Path(__file__).parent.parent / "src" / "content" / "publications"


def sanitize_filename(title):
    """Convert title to a safe filename."""
    # Remove special characters and convert to lowercase
    safe = re.sub(r'[^\w\s-]', '', title.lower())
    safe = re.sub(r'[-\s]+', '-', safe)
    return safe[:100]  # Limit length


def escape_yaml_string(text):
    """Escape special characters for YAML."""
    if not text:
        return ""
    # Replace quotes and handle multiline
    text = text.replace('"', '\\"')
    return text


def format_authors(authors_list, highlight_name="Adam Catto"):
    """Format authors list with HTML bold for the specified name."""
    if not authors_list:
        return ""

    formatted_authors = []
    for author in authors_list:
        if highlight_name.lower() in author.lower():
            formatted_authors.append(f"<strong>{author}</strong>")
        else:
            formatted_authors.append(author)

    return ", ".join(formatted_authors)


def infer_categories(title, description, venue):
    """Infer categories based on title, description, and venue."""
    categories = []
    combined_text = f"{title} {description} {venue}".lower()

    # Check for neuroscience keywords
    neuroscience_keywords = ['neuroscience', 'neural', 'brain', 'behavioral', 'neuron',
                             'habenula', 'intracerebral', 'cholinergic']
    if any(kw in combined_text for kw in neuroscience_keywords):
        categories.append('neuroscience')

    # Check for machine learning keywords
    ml_keywords = ['machine learning', 'deep learning', 'neural network', 'model',
                   'prediction', 'classifier', 'ensemble', 'automl', 'computer vision']
    if any(kw in combined_text for kw in ml_keywords):
        categories.append('machine-learning')

    # Check for clinical informatics keywords
    clinical_keywords = ['clinical', 'patient', 'medical', 'healthcare', 'pregnancy',
                         'preeclampsia', 'disease', 'diagnosis']
    if any(kw in combined_text for kw in clinical_keywords):
        categories.append('clinical-informatics')

    return categories


def infer_publication_type(venue):
    """Infer publication type based on venue."""
    venue_lower = venue.lower()

    if 'arxiv' in venue_lower or 'biorxiv' in venue_lower or 'medrxiv' in venue_lower:
        return 'preprint'
    elif 'conference' in venue_lower or 'proceedings' in venue_lower:
        return 'conference'
    elif 'thesis' in venue_lower or 'dissertation' in venue_lower:
        return 'thesis'
    elif 'journal' in venue_lower or any(word in venue_lower for word in
                                          ['bmc', 'nature', 'science', 'plos', 'ieee']):
        return 'journal'
    elif 'unknown' in venue_lower:
        return 'other'
    else:
        # Default to journal if venue looks like a publication
        return 'journal' if venue and venue != 'Unknown Venue' else 'other'


def fetch_publications():
    """Fetch publications from Google Scholar."""
    print(f"Fetching publications for scholar ID: {SCHOLAR_ID}")

    try:
        # Get author profile
        author = scholarly.search_author_id(SCHOLAR_ID)
        author = scholarly.fill(author, sections=['publications'])

        publications = []
        for pub in author['publications']:
            # Fill in publication details
            try:
                filled_pub = scholarly.fill(pub)

                # Extract year
                year_str = filled_pub['bib'].get('pub_year', '')
                if not year_str:
                    print(f"Skipping publication without valid year: {filled_pub['bib'].get('title', 'Unknown')}")
                    continue

                # Handle both string and int year
                try:
                    year = int(year_str) if isinstance(year_str, str) else year_str
                except (ValueError, TypeError):
                    print(f"Skipping publication with invalid year '{year_str}': {filled_pub['bib'].get('title', 'Unknown')}")
                    continue
                if year < MIN_YEAR:
                    print(f"Skipping publication from {year}: {filled_pub['bib'].get('title', 'Unknown')}")
                    continue

                # Extract citation info
                citations = filled_pub.get('num_citations', 0)
                scholar_id = filled_pub.get('author_pub_id', '')

                # Extract basic info
                title = filled_pub['bib'].get('title', 'Untitled')
                authors = filled_pub['bib'].get('author', '').split(' and ')
                venue = filled_pub['bib'].get('venue', filled_pub['bib'].get('journal', 'Unknown Venue'))

                # Extract URLs
                url = filled_pub.get('pub_url', '')
                pdf_url = filled_pub.get('eprint_url', '')

                # Abstract as description
                description = filled_pub['bib'].get('abstract', '')

                # Infer categories and publication type
                categories = infer_categories(title, description, venue)
                pub_type = infer_publication_type(venue)

                pub_data = {
                    'title': title,
                    'authors': authors,
                    'venue': venue,
                    'year': year,
                    'url': url,
                    'pdf': pdf_url,
                    'description': description,
                    'citations': citations,
                    'scholarId': scholar_id,
                    'categories': categories,
                    'publicationType': pub_type
                }

                publications.append(pub_data)
                print(f"Found: {title} ({year}) - {citations} citations")

                # Be polite to Google Scholar
                time.sleep(2)

            except Exception as e:
                print(f"Error processing publication: {e}")
                continue

        return publications

    except Exception as e:
        print(f"Error fetching publications: {e}")
        sys.exit(1)


def create_publication_file(pub):
    """Create a markdown file for a publication."""
    filename = sanitize_filename(pub['title']) + '.md'
    filepath = PUBLICATIONS_DIR / filename

    # Format authors with bold
    authors_formatted = format_authors(pub['authors'])

    # Build frontmatter
    frontmatter = f"""---
title: "{escape_yaml_string(pub['title'])}"
authors: "{authors_formatted}"
venue: "{escape_yaml_string(pub['venue'])}"
year: {pub['year']}"""

    if pub.get('url'):
        frontmatter += f'\nurl: "{pub["url"]}"'

    if pub.get('pdf'):
        frontmatter += f'\npdf: "{pub["pdf"]}"'

    if pub.get('description'):
        # Truncate long descriptions
        desc = pub['description'][:500]
        frontmatter += f'\ndescription: "{escape_yaml_string(desc)}"'

    if pub.get('citations') is not None:
        frontmatter += f'\ncitations: {pub["citations"]}'

    if pub.get('scholarId'):
        frontmatter += f'\nscholarId: "{pub["scholarId"]}"'

    if pub.get('categories'):
        categories_str = str(pub['categories']).replace("'", '"')
        frontmatter += f'\ncategories: {categories_str}'

    if pub.get('publicationType'):
        frontmatter += f'\npublicationType: "{pub["publicationType"]}"'

    frontmatter += '\n---\n'

    # Write file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter)

    print(f"Created: {filepath.name}")
    return filepath


def update_existing_citations():
    """Update citation counts for existing publications with scholarId."""
    print("\nUpdating citation counts for existing publications...")

    if not PUBLICATIONS_DIR.exists():
        print(f"Publications directory not found: {PUBLICATIONS_DIR}")
        return

    for md_file in PUBLICATIONS_DIR.glob("*.md"):
        try:
            content = md_file.read_text(encoding='utf-8')

            # Extract scholarId from frontmatter
            scholar_id_match = re.search(r'scholarId:\s*"([^"]+)"', content)
            if not scholar_id_match:
                continue

            scholar_id = scholar_id_match.group(1)

            # Fetch updated citation count
            print(f"Updating citations for {md_file.name}...")
            pub = scholarly.search_pubs(scholar_id)
            filled_pub = scholarly.fill(next(pub))
            citations = filled_pub.get('num_citations', 0)

            # Update citation count in file
            if re.search(r'citations:\s*\d+', content):
                updated_content = re.sub(
                    r'citations:\s*\d+',
                    f'citations: {citations}',
                    content
                )
            else:
                # Add citations field before closing ---
                updated_content = re.sub(
                    r'---\n$',
                    f'citations: {citations}\n---\n',
                    content
                )

            md_file.write_text(updated_content, encoding='utf-8')
            print(f"Updated {md_file.name} with {citations} citations")

            time.sleep(2)  # Be polite

        except Exception as e:
            print(f"Error updating {md_file.name}: {e}")
            continue


def main():
    """Main function."""
    print("Google Scholar Publications Updater")
    print("=" * 50)

    # Ensure publications directory exists
    PUBLICATIONS_DIR.mkdir(parents=True, exist_ok=True)

    # Check if we should only update citations
    if len(sys.argv) > 1 and sys.argv[1] == '--update-citations-only':
        update_existing_citations()
        return

    # Fetch all publications
    publications = fetch_publications()
    print(f"\nFound {len(publications)} publications after {MIN_YEAR}")

    # Create publication files
    print("\nCreating publication files...")
    for pub in publications:
        try:
            create_publication_file(pub)
        except Exception as e:
            print(f"Error creating file for '{pub['title']}': {e}")

    print("\nDone!")
    print(f"Publications saved to: {PUBLICATIONS_DIR}")


if __name__ == "__main__":
    main()
