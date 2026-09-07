import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Journal",
    description:
        "Essays, interviews, research notes, and press from Nava Fundacion.",
    path: "/blog",
});

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
