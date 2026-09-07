import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Catalog",
    description:
        "Artworks and editions presented by Nava Fundacion.",
    path: "/catalog",
});

export default function CatalogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
