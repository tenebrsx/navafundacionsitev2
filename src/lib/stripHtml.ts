/**
 * Convert HTML (e.g. TipTap output) into plain text for excerpts,
 * meta descriptions, and other preview surfaces.
 */
export function stripHtml(html: string | undefined | null): string {
    if (!html) return "";

    return html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

/** Plain-text preview truncated to `max` characters. */
export function plainExcerpt(html: string | undefined | null, max = 160): string {
    const text = stripHtml(html);
    if (text.length <= max) return text;
    return `${text.slice(0, max).trimEnd()}…`;
}
