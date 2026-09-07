/** Canonical public site origin (no trailing slash). */
export const SITE_URL =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://navafundacionorg.web.app").replace(
        /\/$/,
        ""
    );

export const SITE_NAME = "Nava Fundacion";
export const SITE_TAGLINE = "Narrativa Alternativa Foundation";
export const SITE_DESCRIPTION =
    "Narrativa Alternativa Foundation — contemporary art, research, and public programs based in Santo Domingo, Dominican Republic.";
export const SITE_LOCALE = "en";
export const SITE_EMAIL = "info@nava-fundacion.org";
export const SITE_INSTAGRAM = "https://www.instagram.com/nava_fundacion/";

export const STATIC_ROUTES = [
    "/",
    "/blog",
    "/events",
    "/projects",
    "/catalog",
    "/team",
    "/about",
    "/story",
    "/mission",
] as const;
