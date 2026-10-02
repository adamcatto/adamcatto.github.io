// Loads the bookshelf from Goodreads' public shelf RSS feeds at build time.
// Goodreads retired its API, but every shelf still has an RSS feed that needs no auth.
import { XMLParser } from "fast-xml-parser";
import { activeBookIds, activeShelf, goodreadsUserId, toRead } from "../data/bookshelf";

export interface FeedDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export interface Book {
  id: string;
  title: string;
  fullTitle: string;
  author: string;
  url: string;
  cover: string;
  rating: number; // 0 = unrated
  pages?: number;
  readAt?: FeedDate;
  addedAt?: FeedDate;
  shelves: string[];
}

export interface ToReadBook {
  title: string;
  author: string;
  url?: string;
  cover?: string;
}

export interface Bookshelf {
  read: Book[];
  active: Book[];
  passive: Book[];
  toRead: ToReadBook[];
}

const PER_PAGE = 200;
const MAX_PAGES = 20;

const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  isArray: (name) => name === "item",
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Feed dates look like "Sun, 20 Sep 2026 19:32:00 -0700". Read the calendar date as
// written rather than converting to UTC, which would move late-evening dates a day.
function parseFeedDate(value: unknown): FeedDate | undefined {
  const match = String(value ?? "").match(/(\d{1,2}) (\w{3}) (\d{4})/);
  if (!match) return undefined;
  const month = MONTHS.indexOf(match[2]) + 1;
  return month ? { year: Number(match[3]), month, day: Number(match[1]) } : undefined;
}

export function formatMonthDay(date: FeedDate): string {
  return `${MONTHS[date.month - 1]} ${date.day}`;
}

export function formatMonthYear(date: FeedDate): string {
  return `${MONTHS[date.month - 1]} ${date.year}`;
}

export function compareDates(a?: FeedDate, b?: FeedDate): number {
  const key = (d?: FeedDate) => (d ? d.year * 10000 + d.month * 100 + d.day : 0);
  return key(a) - key(b);
}

// "Ender's Game (Ender's Saga, #1)" -> "Ender's Game"; "Empire of AI: Dreams and..." -> "Empire of AI"
function shortTitle(title: string): string {
  return title
    .replace(/\s*\([^)]*#[\d.]+\)\s*$/, "")
    .split(/:\s/)[0]
    .trim();
}

// Request a cover large enough for 2x displays instead of the 75px thumbnail.
function coverUrl(item: Record<string, any>): string {
  const src = String(item.book_large_image_url || item.book_medium_image_url || item.book_image_url || "");
  return src.replace(/\._S[XY]\d+_\./, "._SY240_.");
}

function toBook(item: Record<string, any>): Book {
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
    readAt: parseFeedDate(item.user_read_at),
    addedAt: parseFeedDate(item.user_date_added),
    shelves: String(item.user_shelves ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

async function fetchPage(shelf: string, page: number): Promise<Book[]> {
  const feed = `https://www.goodreads.com/review/list_rss/${goodreadsUserId}?shelf=${shelf}&per_page=${PER_PAGE}&page=${page}`;
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(feed, { headers: { "User-Agent": "adamcatto.github.io bookshelf" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = parser.parse(await res.text());
      return (xml?.rss?.channel?.item ?? []).map(toBook);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  throw new Error(`Couldn't load Goodreads shelf "${shelf}" (page ${page}): ${lastError}`);
}

// Pages through a shelf until it runs out, or until `done` says we have what we need.
async function fetchShelf(shelf: string, done?: (books: Book[]) => boolean): Promise<Book[]> {
  const books: Book[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await fetchPage(shelf, page);
    books.push(...batch);
    if (batch.length < PER_PAGE || done?.(books)) break;
  }
  return books;
}

async function load(): Promise<Bookshelf> {
  const wanted = new Set(toRead.map((b) => b.goodreadsId));
  const [read, reading, queue] = await Promise.all([
    fetchShelf("read"),
    fetchShelf("currently-reading"),
    // The to-read shelf is long; stop once every hand-picked book has turned up.
    fetchShelf("to-read", (books) => [...wanted].every((id) => books.some((b) => b.id === id))),
  ]);

  const isActive = (book: Book) => book.shelves.includes(activeShelf) || activeBookIds.includes(book.id);
  const byAdded = (a: Book, b: Book) => compareDates(b.addedAt, a.addedAt);
  const queued = new Map(queue.map((b) => [b.id, b]));

  return {
    read: read.sort((a, b) => compareDates(b.readAt, a.readAt)),
    active: reading.filter(isActive).sort(byAdded),
    passive: reading.filter((b) => !isActive(b)).sort(byAdded),
    toRead: toRead.map((pick) => {
      const match = queued.get(pick.goodreadsId);
      return { title: pick.title, author: pick.author, url: match?.url, cover: match?.cover };
    }),
  };
}

let cached: Promise<Bookshelf> | undefined;

// Production builds fail if Goodreads can't be reached, so a deploy never replaces the
// live bookshelf with an empty one. Local dev degrades to empty shelves instead.
export function getBookshelf(): Promise<Bookshelf> {
  cached ??= load().catch((error) => {
    if (import.meta.env.PROD) throw error;
    console.warn(`[bookshelf] ${error instanceof Error ? error.message : error}`);
    return {
      read: [],
      active: [],
      passive: [],
      toRead: toRead.map(({ title, author }) => ({ title, author })),
    };
  });
  return cached;
}
