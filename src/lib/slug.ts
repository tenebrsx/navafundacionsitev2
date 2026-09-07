/** URL-safe slug from a title or freeform string. */
export function slugify(input: string | undefined | null): string {
    if (!input) return "";
    return input
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

type Sluggable = { id: string; slug?: string; title?: string };

/** Public path for a CMS document — prefers explicit slug, else id. */
export function contentPath(
    collection: "blog" | "events" | "projects" | "catalog" | "team",
    item: Sluggable
): string {
    const segment = item.slug || slugify(item.title) || item.id;
    return `/${collection}/${segment}`;
}
