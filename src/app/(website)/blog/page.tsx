import BlogIndexClient from "@/components/BlogIndexClient";
import { getAllPosts } from "@/lib/content";

export default async function BlogPage() {
    const posts = await getAllPosts();
    return <BlogIndexClient initialPosts={posts} />;
}
