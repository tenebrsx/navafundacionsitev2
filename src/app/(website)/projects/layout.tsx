import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Projects",
    description:
        "Exhibitions, research, and commissions in the Nava Fundacion archive.",
    path: "/projects",
});

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
