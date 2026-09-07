import type { Metadata } from "next";
import TeamMemberClient from "@/components/TeamMemberClient";
import {
    getAllTeam,
    pathParamsForItem,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { contentPath, slugify } from "@/lib/slug";

export async function generateStaticParams() {
    try {
        const team = await getAllTeam();
        const fromCms = team.flatMap((member) =>
            pathParamsForItem({
                id: member.id,
                slug: member.slug,
                title: member.name,
            })
        );
        const mockIds = ["1", "2", "3", "4"].map((id) => ({ id }));
        const seen = new Set<string>();
        return [...fromCms, ...mockIds].filter(({ id }) => {
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    } catch (error) {
        console.error("Error generating static params for team:", error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const team = await getAllTeam();
    const member = team.find(
        (m) =>
            m.id === id ||
            m.slug === id ||
            slugify(m.name) === id
    );

    if (!member) {
        return buildMetadata({
            title: "Team Member",
            path: `/team/${id}`,
            noIndex: true,
        });
    }

    return buildMetadata({
        title: member.name,
        description: member.bio || `${member.name}${member.role ? ` — ${member.role}` : ""} at Nava Fundacion`,
        path: contentPath("team", {
            id: member.id,
            slug: member.slug,
            title: member.name,
        }),
        image: member.image,
    });
}

export default async function TeamMemberPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <TeamMemberClient id={id} />;
}
