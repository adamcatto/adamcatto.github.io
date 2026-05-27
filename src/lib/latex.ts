/**
 * LaTeX processing utilities for converting .tex files to HTML.
 * Requires pandoc to be installed for full LaTeX support.
 *
 * For essays written in pure LaTeX, place a .tex file in the essay folder
 * alongside a metadata.json file with the frontmatter data.
 */

import { exec } from "child_process";
import { promisify } from "util";
import { readFile, access } from "fs/promises";
import { constants } from "fs";

const execAsync = promisify(exec);

export interface LatexMetadata {
  title: string;
  description?: string;
  date: string;
  updated?: string;
  draft?: boolean;
  tags?: string[];
}

/**
 * Check if pandoc is available on the system
 */
export async function isPandocAvailable(): Promise<boolean> {
  try {
    await execAsync("pandoc --version");
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a LaTeX file to HTML using pandoc
 * @param texPath Path to the .tex file
 * @returns HTML string
 */
export async function convertLatexToHtml(texPath: string): Promise<string> {
  const hasPandoc = await isPandocAvailable();

  if (!hasPandoc) {
    throw new Error(
      "Pandoc is not installed. Install it with: brew install pandoc"
    );
  }

  try {
    // Use pandoc with KaTeX for math rendering
    const { stdout } = await execAsync(
      `pandoc "${texPath}" -f latex -t html --mathjax --standalone=false`,
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer for large documents
    );
    return stdout;
  } catch (error) {
    console.error(`Error converting LaTeX file ${texPath}:`, error);
    throw error;
  }
}

/**
 * Read metadata from a JSON file alongside a LaTeX essay
 */
export async function readLatexMetadata(
  metadataPath: string
): Promise<LatexMetadata | null> {
  try {
    await access(metadataPath, constants.R_OK);
    const content = await readFile(metadataPath, "utf-8");
    return JSON.parse(content) as LatexMetadata;
  } catch {
    return null;
  }
}
