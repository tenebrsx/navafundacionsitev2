import type { Metadata } from "next";
import { plainExcerpt } from "@/lib/stripHtml";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_URL,
} from "@/lib/site";

type BuildMetadataInput = {
    title?: string;
    description?: string;
    path?: string;
    image?: string | null;
    type?: "website" | "article";
    noIndex?: boolean;
    publishedTime?: string;
    authors?: string[];
};

export function absoluteUrl(path = "/"): string {
    if (path.startsWith("http")) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function buildMetadata({
    title,
    description,
    path = "/",
    image,
    type = "website",
    noIndex = false,
    publishedTime,
    authors,
}: BuildMetadataInput): Metadata {
    const pageTitle = title?.trim() || SITE_NAME;
    const fullTitle =
        pageTitle === SITE_NAME ? SITE_NAME : `${pageTitle} | ${SITE_NAME}`;
    const desc = plainExcerpt(description || SITE_DESCRIPTION, 160);
    const url = absoluteUrl(path);
    const ogImage = image ? absoluteUrl(image) : undefined;

    return {
        title:
            pageTitle === SITE_NAME
                ? { absolute: SITE_NAME }
                : pageTitle,
        description: desc,
        alternates: { canonical: url },
        robots: noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
        openGraph: {
            type,
            url,
            siteName: SITE_NAME,
            title: fullTitle,
            description: desc,
            locale: "en_US",
            ...(ogImage
                ? { images: [{ url: ogImage, alt: pageTitle }] }
                : {}),
            ...(type === "article" && publishedTime
                ? { publishedTime }
                : {}),
            ...(type === "article" && authors?.length
                ? { authors }
                : {}),
        },
        twitter: {
            card: ogImage ? "summary_large_image" : "summary",
            title: fullTitle,
            description: desc,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        alternateName: SITE_TAGLINE,
        url: SITE_URL,
        email: "info@nava-fundacion.org",
        description: SITE_DESCRIPTION,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Santo Domingo",
            addressCountry: "DO",
        },
        sameAs: ["https://www.instagram.com/nava_fundacion/"],
    };
}

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { "@type": "Organization", name: SITE_NAME },
    };
}

export function articleJsonLd(post: {
    title: string;
    description?: string;
    path: string;
    image?: string | null;
    date?: string;
    author?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: plainExcerpt(post.description, 160),
        url: absoluteUrl(post.path),
        ...(post.image ? { image: [absoluteUrl(post.image)] } : {}),
        ...(post.date ? { datePublished: post.date } : {}),
        ...(post.author
            ? { author: { "@type": "Person", name: post.author } }
            : { author: { "@type": "Organization", name: SITE_NAME } }),
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
        mainEntityOfPage: absoluteUrl(post.path),
    };
}

export function eventJsonLd(event: {
    title: string;
    description?: string;
    path: string;
    image?: string | null;
    startDate?: string;
    endDate?: string;
    date?: string;
    location?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: plainExcerpt(event.description, 160),
        url: absoluteUrl(event.path),
        ...(event.image ? { image: absoluteUrl(event.image) } : {}),
        startDate: event.startDate || event.date,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
            "@type": "Place",
            name: event.location || "Nava Fundacion",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Santo Domingo",
                addressCountry: "DO",
            },
        },
        organizer: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
    };
}
