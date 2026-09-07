import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Mission",
    description:
        "Mission and principles of Narrativa Alternativa Foundation.",
    path: "/mission",
});

export default function MissionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
