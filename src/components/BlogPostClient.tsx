"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BlogPostDetail from "@/components/BlogPostDetail";
import Link from "next/link";

interface Post {
    id: string;
    title: string;
    date: string;
    category: string;
    content?: string;
    imageUrl?: string;
    author?: string;
}

export default function BlogPostClient({ id }: { id: string }) {
    const [post, setPost] = useState<Post | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch ALL posts to find current and related
                // (In a larger app, we'd fetch single doc by ID, but this allows us to get related posts easily for now)
                const q = query(collection(db, "posts"));
                const querySnapshot = await getDocs(q);
                const allPosts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Post[];

                // Find the specific post
                // Try to find by ID first
                let foundPost = allPosts.find((p) => p.id === id);

                // Fallback: If using mock data indexes as IDs (e.g. 0, 1) in URL but real data has UUIDs,
                // we might mismatch. But here we assume consistency.
                // If not found in DB, check if we need to return a fallback mock? 
                // Using mock fallback for demo if DB is empty/missing this ID.
                if (!foundPost && ["0", "1", "2", "3"].includes(id)) {
                    const mockPosts: Post[] = [
                        { id: "0", title: "The Architecture of Silence", date: "2025.04.12", category: "Essay", content: "To speak of silence in the Caribbean is to speak of the gaps in the archive...", author: "Elena M." },
                        { id: "1", title: "In Conversation: Sofia Lora", date: "2025.03.28", category: "Interview", content: "SL: The process begins with the material itself...", author: "Nava Team" },
                        { id: "2", title: "Notes on Tropical Entropy", date: "2025.03.15", category: "Research", content: "Entropy is not disorder, but a different kind of order...", author: "Research Unit" },
                        { id: "3", title: "Archive as Method", date: "2025.02.10", category: "Theory", content: "We do not just keep the past; we reproduce it...", author: "Guest Curator" }
                    ];
                    foundPost = mockPosts.find(p => p.id === id) || mockPosts[0]; // fallback
                }

                if (foundPost) {
                    setPost(foundPost);

                    // Get related (simple: just recent ones excluding current)
                    const others = allPosts.length > 0
                        ? allPosts.filter(p => p.id !== foundPost!.id).slice(0, 3)
                        : []; // If using mock, no 'others' from DB logic here unless we mock that too. 

                    setRelatedPosts(others);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return <div className="p-24 text-center font-mono text-[#002FA7] animate-pulse">Loading Entry...</div>;
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[#002FA7] gap-4">
                <h1 className="text-4xl font-normal">Entry Not Found</h1>
                <Link href="/blog" className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-6 py-3 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors">
                    Return to Journal
                </Link>
            </div>
        );
    }

    return <BlogPostDetail post={post} relatedPosts={relatedPosts} />;
}
