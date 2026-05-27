/**
 * Fetches commit history for a specific file from the GitHub API.
 * Used at build time to show version history on essay pages.
 */

export interface Commit {
  sha: string;
  message: string;
  date: string;
  author: string;
  url: string;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch?: string;
}

const config: GitHubConfig = {
  owner: "adamcatto",
  repo: "adamcatto.github.io", // Update this to your actual repo
  branch: "main",
};

/**
 * Fetches commit history for a file from GitHub's REST API.
 * Returns an empty array if the fetch fails (to not break builds).
 */
export async function getFileCommitHistory(
  filePath: string,
  maxCommits = 10
): Promise<Commit[]> {
  const { owner, repo, branch } = config;

  // GitHub API endpoint for commits affecting a specific file
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&sha=${branch}&per_page=${maxCommits}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add token if you hit rate limits: "Authorization": `token ${process.env.GITHUB_TOKEN}`
      },
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch commit history for ${filePath}: ${response.status}`
      );
      return [];
    }

    const data = await response.json();

    return data.map((commit: any) => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split("\n")[0], // First line only
      date: commit.commit.author.date,
      author: commit.commit.author.name,
      url: commit.html_url,
    }));
  } catch (error) {
    console.warn(`Error fetching commit history for ${filePath}:`, error);
    return [];
  }
}

/**
 * Formats a date string for display
 */
export function formatCommitDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
