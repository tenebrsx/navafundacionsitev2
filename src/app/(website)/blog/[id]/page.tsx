import type { Metadata } from "next";
import Link from "next/link";
import BlogPostDetail from "@/components/BlogPostDetail";
import JsonLd from "@/components/seo/JsonLd";
import {
    getAllPosts,
    getPostByParam,
    getRelatedPosts,
    pathParamsForItem,
    postImage,
    postSeoDescription,
    postSeoTitle,
} from "@/lib/content";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { contentPath } from "@/lib/slug";

export async function generateStaticParams() {
    try {
        const posts = await getAllPosts();
        const fromCms = posts.flatMap((post) => pathParamsForItem(post));
        const mockIds = ["0", "1", "2", "3"].map((id) => ({ id }));
        const seen = new Set<string>();
        return [...fromCms, ...mockIds].filter(({ id }) => {
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    } catch (error) {
        console.error("Error generating static params for blog:", error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const post = await getPostByParam(id);

    if (!post) {
        return buildMetadata({
            title: "Entry Not Found",
            path: `/blog/${id}`,
            noIndex: true,
        });
    }

    const path = contentPath("blog", post);
    return buildMetadata({
        title: postSeoTitle(post),
        description: postSeoDescription(post),
        path,
        image: postImage(post),
        type: "article",
        publishedTime: post.date,
        authors: post.author ? [post.author] : undefined,
    });
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPostByParam(id);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[#002FA7] gap-4">
                <h1 className="text-4xl font-normal">Entry Not Found</h1>
                <Link
                    href="/blog"
                    className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-6 py-3 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors"
                >
                    Return to Journal
                </Link>
            </div>
        );
    }

    const relatedPosts = await getRelatedPosts(post.id);
    const path = contentPath("blog", post);

    return (
        <>
            <JsonLd
                data={articleJsonLd({
                    title: postSeoTitle(post),
                    description: postSeoDescription(post),
                    path,
                    image: postImage(post),
                    date: post.date,
                    author: post.author,
                })}
            />
            <BlogPostDetail post={post} relatedPosts={relatedPosts} />
        </>
    );
}
