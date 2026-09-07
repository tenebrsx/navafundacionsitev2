import type { Metadata } from "next";
import Link from "next/link";
import ArtworkDetail from "@/components/ArtworkDetail";
import JsonLd from "@/components/seo/JsonLd";
import {
    getAllArtworks,
    getArtworkByParam,
    pathParamsForItem,
} from "@/lib/content";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { contentPath } from "@/lib/slug";
import { plainExcerpt } from "@/lib/stripHtml";
import { SITE_NAME } from "@/lib/site";

export async function generateStaticParams() {
    try {
        const artworks = await getAllArtworks();
        const fromCms = artworks.flatMap((artwork) => pathParamsForItem(artwork));
        const fallbackIds = ["1", "2", "3"].map((id) => ({ id }));
        const seen = new Set<string>();
        return [...fromCms, ...fallbackIds].filter(({ id }) => {
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    } catch (error) {
        console.error("Error generating static params for catalog:", error);
        return [{ id: "1" }];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const artwork = await getArtworkByParam(id);

    if (!artwork) {
        return buildMetadata({
            title: "Artwork Not Found",
            path: `/catalog/${id}`,
            noIndex: true,
        });
    }

    const path = contentPath("catalog", artwork);
    const image = artwork.mainImage || artwork.image || artwork.imageUrl;
    return buildMetadata({
        title: artwork.seoTitle || artwork.title,
        description:
            plainExcerpt(artwork.seoDescription, 160) ||
            plainExcerpt(artwork.description, 160) ||
            `${artwork.title}${artwork.artist ? ` by ${artwork.artist}` : ""}`,
        path,
        image,
    });
}

export default async function ArtworkPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const artwork = await getArtworkByParam(id);

    if (!artwork) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[#002FA7] gap-6">
                <h1 className="text-4xl font-normal">Artwork Not Found</h1>
                <Link
                    href="/catalog"
                    className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-6 py-3 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors"
                >
                    Return to Catalog
                </Link>
            </div>
        );
    }

    const path = contentPath("catalog", artwork);
    const image = artwork.mainImage || artwork.image || artwork.imageUrl;

    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "VisualArtwork",
                    name: artwork.title,
                    description: plainExcerpt(artwork.description, 160),
                    url: absoluteUrl(path),
                    ...(image ? { image: absoluteUrl(image) } : {}),
                    ...(artwork.artist
                        ? { creator: { "@type": "Person", name: artwork.artist } }
                        : {}),
                    provider: {
                        "@type": "Organization",
                        name: SITE_NAME,
                    },
                }}
            />
            <ArtworkDetail artwork={artwork as any} />
        </>
    );
}
