import type { ImageMetadata } from "astro";

export function getShowcaseSlug(id: string): string {
  return id.replace(/\/index$/, "");
}

export function getVideoEmbedUrl(video: string): string | null {
  if (video.includes("youtube.com") || video.includes("youtu.be")) {
    return video.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
  }
  if (video.includes("vimeo.com")) {
    return video.replace("vimeo.com/", "player.vimeo.com/video/");
  }
  return null;
}

export interface ShowcaseLink {
  href: string;
  label: string;
  title: string;
}

export interface ShowcaseVideo {
  src: string;
  title?: string;
}

export interface ShowcaseItemData {
  title: string;
  description?: string;
  thumbnail?: ImageMetadata;
  video?: string;
  videos?: ShowcaseVideo[];
  url?: string;
  github?: string;
  docs?: string;
  pypi?: string;
  npm?: string;
  language?: string;
  tags?: string[];
}

export function getPrimaryVideo(data: ShowcaseItemData): string | undefined {
  return data.videos?.[0]?.src ?? data.video;
}

export function getProjectLinks(data: ShowcaseItemData): ShowcaseLink[] {
  const links: ShowcaseLink[] = [];
  if (data.github) links.push({ href: data.github, label: "GitHub", title: "View on GitHub" });
  if (data.url) links.push({ href: data.url, label: "Website", title: "Visit project website" });
  return links;
}

export function getSoftwareLinks(data: ShowcaseItemData): ShowcaseLink[] {
  const links: ShowcaseLink[] = [];
  if (data.github) links.push({ href: data.github, label: "GitHub", title: "View on GitHub" });
  if (data.url) links.push({ href: data.url, label: "Website", title: "Visit project website" });
  if (data.docs) links.push({ href: data.docs, label: "Docs", title: "Documentation" });
  if (data.pypi) links.push({ href: data.pypi, label: "PyPI", title: "PyPI package" });
  if (data.npm) links.push({ href: data.npm, label: "npm", title: "npm package" });
  return links;
}
