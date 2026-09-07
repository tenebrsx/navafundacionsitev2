import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "About",
    description:
        "About Narrativa Alternativa Foundation — mission, story, and programs in Santo Domingo.",
    path: "/about",
});

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
