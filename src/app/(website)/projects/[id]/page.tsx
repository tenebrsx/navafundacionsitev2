import type { Metadata } from "next";
import Link from "next/link";
import ProjectPostDetail from "@/components/ProjectPostDetail";
import JsonLd from "@/components/seo/JsonLd";
import {
    getAllProjects,
    getProjectByParam,
    pathParamsForItem,
} from "@/lib/content";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { contentPath } from "@/lib/slug";
import { plainExcerpt } from "@/lib/stripHtml";
import { SITE_NAME } from "@/lib/site";

export async function generateStaticParams() {
    try {
        const projects = await getAllProjects();
        const fromCms = projects.flatMap((project) => pathParamsForItem(project));
        const mockIds = ["1", "2", "3", "4", "5", "6"].map((id) => ({ id }));
        const seen = new Set<string>();
        return [...fromCms, ...mockIds].filter(({ id }) => {
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    } catch (error) {
        console.error("Error generating static params for projects:", error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const project = await getProjectByParam(id);

    if (!project) {
        return buildMetadata({
            title: "Project Not Found",
            path: `/projects/${id}`,
            noIndex: true,
        });
    }

    const path = contentPath("projects", project);
    return buildMetadata({
        title: project.seoTitle || project.title,
        description:
            plainExcerpt(project.seoDescription, 160) ||
            plainExcerpt(project.description, 160) ||
            plainExcerpt(project.content, 160),
        path,
        image: project.imageUrl || project.image,
    });
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectByParam(id);

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[#002FA7] gap-4">
                <h1 className="text-4xl font-normal">Project Not Found</h1>
                <Link
                    href="/projects"
                    className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-6 py-3 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors"
                >
                    Return to Index
                </Link>
            </div>
        );
    }

    const path = contentPath("projects", project);
    const description =
        plainExcerpt(project.seoDescription, 160) ||
        plainExcerpt(project.description, 160);

    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "CreativeWork",
                    name: project.title,
                    description,
                    url: absoluteUrl(path),
                    ...(project.imageUrl || project.image
                        ? {
                              image: absoluteUrl(
                                  (project.imageUrl || project.image)!
                              ),
                          }
                        : {}),
                    ...(project.year ? { dateCreated: project.year } : {}),
                    creator: {
                        "@type": "Organization",
                        name: SITE_NAME,
                    },
                }}
            />
            <ProjectPostDetail project={project} />
        </>
    );
}
