// Bookshelf settings. "Read" and "Currently reading" come from Goodreads via
// `npm run sync:goodreads` (run on a schedule in CI); only the choices below are made by hand.
// Plain JS so both the sync script and the site can import it.

export const goodreadsUserId = "63209512";
export const goodreadsProfile = "https://www.goodreads.com/user/show/63209512-adam-catto";

// Currently-reading books are "Active" if they're on this Goodreads shelf...
export const activeShelf = "active";

// ...or if their Goodreads book ID is listed here. Everything else is "Passive".
/** @type {string[]} */
export const activeBookIds = [
  "9544", // Owning Your Own Shadow
  "829182", // Computer Systems: A Programmer's Perspective
  "116364802", // Deep Reinforcement Learning
  "245544823", // Reinforcement Learning from Human Feedback
];

// A short, hand-picked "To read" list, in order. Covers and links are filled in
// from the Goodreads to-read shelf when the book ID is found there.
/** @type {{ goodreadsId: string; title: string; author: string }[]} */
export const toRead = [
  { goodreadsId: "3828902", title: "Thinking in Systems", author: "Donella H. Meadows" },
  { goodreadsId: "116164", title: "Nonlinear Dynamics and Chaos", author: "Steven H. Strogatz" },
  { goodreadsId: "150131", title: "The First Three Minutes", author: "Steven Weinberg" },
];
