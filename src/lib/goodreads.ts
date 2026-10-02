// The bookshelf, read from the Goodreads snapshot that scripts/sync-goodreads.mjs writes.
// The build never talks to Goodreads; CI keeps the snapshot fresh.
import snapshot from "../data/goodreads.json";
import { activeBookIds, activeShelf, toRead } from "../data/bookshelf.mjs";

export interface Book {
  id: string;
  title: string;
  fullTitle: string;
  author: string;
  url: string;
  cover: string;
  rating: number; // 0 = unrated
  pages?: number;
  readAt?: string; // YYYY-MM-DD
  addedAt?: string; // YYYY-MM-DD
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parts = (date: string) => date.split("-").map(Number);

export function yearOf(date: string): number {
  return parts(date)[0];
}

export function formatMonthDay(date: string): string {
  const [, month, day] = parts(date);
  return `${MONTHS[month - 1]} ${day}`;
}

export function formatMonthYear(date: string): string {
  const [year, month] = parts(date);
  return `${MONTHS[month - 1]} ${year}`;
}

export function getBookshelf(): Bookshelf {
  const isActive = (book: Book) => book.shelves.includes(activeShelf) || activeBookIds.includes(book.id);
  const reading = snapshot.currentlyReading as Book[];
  const queued = new Map((snapshot.toRead as Book[]).map((b) => [b.id, b]));

  return {
    read: snapshot.read as Book[],
    active: reading.filter(isActive),
    passive: reading.filter((b) => !isActive(b)),
    toRead: toRead.map((pick) => {
      const match = queued.get(pick.goodreadsId);
      return { title: pick.title, author: pick.author, url: match?.url, cover: match?.cover };
    }),
  };
}
