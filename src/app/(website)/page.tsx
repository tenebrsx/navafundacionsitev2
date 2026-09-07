import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { buildMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
});

export default function Home() {
    return <HomeClient />;
}
