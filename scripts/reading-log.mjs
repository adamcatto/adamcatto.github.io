// Adds an entry to the reading log (src/content/reading/<date>-<slug>.md).
//
//   npm run log                  interactive prompts, for adding from the terminal
//   node scripts/reading-log.mjs --from-issue
//                                reads a "Reading log" issue form body from $ISSUE_BODY
//                                (used by .github/workflows/reading-log.yml)
import { existsSync } from "node:fs";
import { appendFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";

const KINDS = ["chapter", "paper", "essay", "article", "other"];
const DIR = new URL("../src/content/reading/", import.meta.url);

// Today's date where Adam is, not in UTC.
function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}

function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

function validate(entry) {
  const errors = [];
  if (!entry.title) errors.push("a title is required");
  if (!KINDS.includes(entry.kind)) errors.push(`kind must be one of: ${KINDS.join(", ")}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || Number.isNaN(Date.parse(entry.date)))
    errors.push(`date must look like YYYY-MM-DD (got "${entry.date}")`);
  if (entry.url && !/^https?:\/\/\S+$/.test(entry.url)) errors.push(`link must be an http(s) URL (got "${entry.url}")`);
  if (errors.length) throw new Error(`Invalid reading-log entry: ${errors.join("; ")}.`);
}

async function writeEntry(entry) {
  validate(entry);
  const base = `${entry.date}-${slugify(entry.title) || "entry"}`;
  let name = `${base}.md`;
  for (let n = 2; existsSync(new URL(name, DIR)); n++) name = `${base}-${n}.md`;

  // JSON strings are valid YAML scalars, so quoting with JSON.stringify is always safe.
  const fields = ["date", "kind", "title", "from", "author", "url"].filter((key) => entry[key]);
  const frontmatter = fields.map((key) => `${key}: ${JSON.stringify(entry[key])}`).join("\n");
  const body = entry.notes ? `\n${entry.notes.trim()}\n` : "";
  await writeFile(new URL(name, DIR), `---\n${frontmatter}\n---\n${body}`);
  return `src/content/reading/${name}`;
}

// Issue forms render each field as "### Label\n\nvalue"; empty fields read "_No response_".
function parseIssueForm(body) {
  const fields = {};
  const sections = body.replace(/\r\n/g, "\n").split(/^### /m).slice(1);
  for (const section of sections) {
    const [label, ...rest] = section.split("\n");
    const value = rest.join("\n").trim();
    fields[label.trim().toLowerCase()] = value === "_No response_" ? "" : value;
  }
  return {
    kind: (fields["kind"] || "").toLowerCase(),
    title: fields["title"] || "",
    from: fields["from"] || "",
    author: fields["author"] || "",
    url: fields["link"] || "",
    date: fields["date"] || today(),
    notes: fields["notes"] || "",
  };
}

async function prompt() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (question, fallback = "") => (await rl.question(question)).trim() || fallback;
  try {
    const kind = await ask(`Kind (${KINDS.join("/")}) [paper]: `, "paper");
    const title = await ask("Title: ");
    const from = await ask("From (book, journal, site; optional): ");
    const author = await ask("Author (optional): ");
    const url = await ask("Link (optional): ");
    const date = await ask(`Date [${today()}]: `, today());
    console.log("Notes (optional; Markdown is fine). Finish with an empty line:");
    const lines = [];
    for (let line; (line = await rl.question("")) !== ""; ) lines.push(line);
    return { kind: kind.toLowerCase(), title, from, author, url, date, notes: lines.join("\n") };
  } finally {
    rl.close();
  }
}

const fromIssue = process.argv.includes("--from-issue");
const entry = fromIssue ? parseIssueForm(process.env.ISSUE_BODY ?? "") : await prompt();
const file = await writeEntry(entry);
console.log(`Added ${file}`);

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `file=${file}\ntitle=${entry.title.replace(/\n/g, " ")}\n`);
}
