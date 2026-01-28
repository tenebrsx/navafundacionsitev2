import BlogPostClient from "@/components/BlogPostClient";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Generate paths for ALL blog posts at build time (SSG)
export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const paths = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));

        // Also include mock IDs if we are supporting them in fallback 
        // (Optional, but good for reliable build if DB is empty)
        const mockIds = [{ id: "0" }, { id: "1" }, { id: "2" }, { id: "3" }];

        // Unique merge
        const uniqueIds = new Set([...paths.map(p => p.id), ...mockIds.map(p => p.id)]);
        return Array.from(uniqueIds).map(id => ({ id }));

    } catch (error) {
        console.error("Error generating static params for blog:", error);
        return [];
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <BlogPostClient id={id} />;
}
