// Pulls the bookshelf from Goodreads' public shelf RSS feeds into src/data/goodreads.json.
// Goodreads retired its API, but every shelf still has an RSS feed that needs no auth.
// Runs on a schedule in CI (.github/workflows/sync-goodreads.yml); the site only reads the snapshot.
//
//   npm run sync:goodreads
import { writeFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import { goodreadsUserId, toRead } from "../src/data/bookshelf.mjs";

const OUTPUT = new URL("../src/data/goodreads.json", import.meta.url);
const PER_PAGE = 200;
const MAX_PAGES = 20;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  isArray: (name) => name === "item",
});

// Feed dates look like "Sun, 20 Sep 2026 19:32:00 -0700". Keep the calendar date as
// written rather than converting to UTC, which would move late-evening dates a day.
function feedDate(value) {
  const match = String(value ?? "").match(/(\d{1,2}) (\w{3}) (\d{4})/);
  const month = match ? MONTHS.indexOf(match[2]) + 1 : 0;
  if (!month) return undefined;
  return `${match[3]}-${String(month).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

// "Ender's Game (Ender's Saga, #1)" -> "Ender's Game"; "Empire of AI: Dreams and..." -> "Empire of AI"
function shortTitle(title) {
  return title
    .replace(/\s*\([^)]*#[\d.]+\)\s*$/, "")
    .split(/:\s/)[0]
    .trim();
}

// Request a cover large enough for 2x displays instead of the 75px thumbnail.
function coverUrl(item) {
  const src = String(item.book_large_image_url || item.book_medium_image_url || item.book_image_url || "");
  return src.replace(/\._S[XY]\d+_\./, "._SY240_.");
}

function toBook(item) {
  const fullTitle = String(item.title ?? "").trim();
  const pages = Number(item.book?.num_pages);
  return {
    id: String(item.book_id),
    title: shortTitle(fullTitle),
    fullTitle,
    author: String(item.author_name ?? "").replace(/\s+/g, " ").trim(),
    url: `https://www.goodreads.com/book/show/${item.book_id}`,
    cover: coverUrl(item),
    rating: Number(item.user_rating) || 0,
    pages: Number.isFinite(pages) && pages > 0 ? pages : undefined,
    readAt: feedDate(item.user_read_at),
    addedAt: feedDate(item.user_date_added),
    shelves: String(item.user_shelves ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

async function fetchPage(shelf, page) {
  const feed = `https://www.goodreads.com/review/list_rss/${goodreadsUserId}?shelf=${shelf}&per_page=${PER_PAGE}&page=${page}`;
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(feed, { headers: { "User-Agent": "adamcatto.github.io bookshelf sync" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = parser.parse(await res.text());
      if (!xml?.rss?.channel) throw new Error("unexpected response (no RSS channel)");
      return (xml.rss.channel.item ?? []).map(toBook);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
  throw new Error(`Couldn't load Goodreads shelf "${shelf}" (page ${page}): ${lastError}`);
}

// Pages through a shelf until it runs out, or until `done` says we have what we need.
async function fetchShelf(shelf, done) {
  const books = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await fetchPage(shelf, page);
    books.push(...batch);
    if (batch.length < PER_PAGE || done?.(books)) break;
  }
  return books;
}

const byDateDesc = (key) => (a, b) => (b[key] ?? "").localeCompare(a[key] ?? "") || a.id.localeCompare(b.id);
const wanted = new Set(toRead.map((b) => b.goodreadsId));

const [read, currentlyReading, queue] = await Promise.all([
  fetchShelf("read"),
  fetchShelf("currently-reading"),
  // The to-read shelf is long; stop once every hand-picked book has turned up.
  fetchShelf("to-read", (books) => [...wanted].every((id) => books.some((b) => b.id === id))),
]);

// A read shelf that suddenly comes back empty is far more likely a Goodreads hiccup
// than a real change, so refuse to overwrite the snapshot with it.
if (read.length === 0) throw new Error("Goodreads returned an empty read shelf; keeping the existing snapshot.");

const snapshot = {
  read: read.sort(byDateDesc("readAt")),
  currentlyReading: currentlyReading.sort(byDateDesc("addedAt")),
  toRead: queue.filter((b) => wanted.has(b.id)),
};

await writeFile(OUTPUT, JSON.stringify(snapshot, null, 2) + "\n");
console.log(
  `Synced ${snapshot.read.length} read, ${snapshot.currentlyReading.length} reading, ` +
    `${snapshot.toRead.length}/${wanted.size} picked to-read books.`
);
