import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Events",
    description:
        "Exhibitions, fairs, and public programs from Nava Fundacion.",
    path: "/events",
});

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
