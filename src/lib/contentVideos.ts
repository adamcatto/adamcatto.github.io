const projectVideos = import.meta.glob<string>(
  "../content/projects/**/*.{mp4,webm,mov}",
  { eager: true, query: "?url", import: "default" }
);

const softwareVideos = import.meta.glob<string>(
  "../content/software/**/*.{mp4,webm,mov}",
  { eager: true, query: "?url", import: "default" }
);

export interface ContentVideo {
  src: string;
  title?: string;
}

function resolveCoLocatedVideo(
  assets: Record<string, string>,
  slug: string,
  src: string
): string {
  if (src.startsWith("http") || src.startsWith("/")) {
    return src;
  }

  const filename = src.replace(/^\.\//, "");
  const match = Object.entries(assets).find(([path]) =>
    path.includes(`/${slug}/${filename}`)
  );

  return match?.[1] ?? src;
}

export function resolveProjectVideo(slug: string, src: string): string {
  return resolveCoLocatedVideo(projectVideos, slug, src);
}

export function resolveSoftwareVideo(slug: string, src: string): string {
  return resolveCoLocatedVideo(softwareVideos, slug, src);
}

export function resolveProjectVideos(slug: string, videos: ContentVideo[]): ContentVideo[] {
  return videos.map((video) => ({
    ...video,
    src: resolveProjectVideo(slug, video.src),
  }));
}

export function resolveSoftwareVideos(slug: string, videos: ContentVideo[]): ContentVideo[] {
  return videos.map((video) => ({
    ...video,
    src: resolveSoftwareVideo(slug, video.src),
  }));
}
