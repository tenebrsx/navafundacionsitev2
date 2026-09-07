import type { MetadataRoute } from "next";
import {
    getAllArtworks,
    getAllEvents,
    getAllPosts,
    getAllProjects,
    getAllTeam,
} from "@/lib/content";
import { contentPath } from "@/lib/slug";
import { SITE_URL, STATIC_ROUTES } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date();

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
        url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
        lastModified,
        changeFrequency: path === "/" ? "weekly" : "weekly",
        priority: path === "/" ? 1 : 0.7,
    }));

    try {
        const [posts, events, projects, artworks, team] = await Promise.all([
            getAllPosts(),
            getAllEvents(),
            getAllProjects(),
            getAllArtworks(),
            getAllTeam(),
        ]);

        const dynamicEntries: MetadataRoute.Sitemap = [
            ...posts.map((post) => ({
                url: `${SITE_URL}${contentPath("blog", post)}`,
                lastModified,
                changeFrequency: "monthly" as const,
                priority: 0.8,
            })),
            ...events.map((event) => ({
                url: `${SITE_URL}${contentPath("events", event)}`,
                lastModified,
                changeFrequency: "weekly" as const,
                priority: 0.8,
            })),
            ...projects.map((project) => ({
                url: `${SITE_URL}${contentPath("projects", project)}`,
                lastModified,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            })),
            ...artworks.map((artwork) => ({
                url: `${SITE_URL}${contentPath("catalog", artwork)}`,
                lastModified,
                changeFrequency: "monthly" as const,
                priority: 0.6,
            })),
            ...team.map((member) => ({
                url: `${SITE_URL}${contentPath("team", { id: member.id, slug: member.slug, title: member.name })}`,
                lastModified,
                changeFrequency: "monthly" as const,
                priority: 0.5,
            })),
        ];

        return [...staticEntries, ...dynamicEntries];
    } catch (error) {
        console.error("sitemap generation failed:", error);
        return staticEntries;
    }
}
