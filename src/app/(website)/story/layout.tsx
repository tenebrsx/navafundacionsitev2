import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Our Story",
    description:
        "The story of Nava Fundacion and Narrativa Alternativa in the Dominican Republic.",
    path: "/story",
});

export default function StoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
