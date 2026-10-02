// The site can be built under a sub-path (e.g. the staging build at /new-version/),
// so internal links go through `url()` instead of hard-coding a leading "/".
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

export const isStaging = base !== "";

export function url(path = "/"): string {
  return `${base}/${path.replace(/^\/+/, "")}`;
}

// Strips the base so routes can be compared against plain paths like "/writing".
export function stripBase(pathname: string): string {
  return isStaging && pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
}
