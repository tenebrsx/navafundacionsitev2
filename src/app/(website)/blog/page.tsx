"use client";

import { useEffect, useState, Suspense } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import StaggeredGrid from "@/components/anim/StaggeredGrid";
import { ArrowUpRight } from "lucide-react";

interface Post {
    id: string;
    title: string;
    date: string;
    category: string;
    content?: string;
    imageUrl?: string;
}

function BlogPageContent() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "posts"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Post[];

                // If no real data, fall back to mock data for demo purposes if needed, 
                // but generally we want to show real data. 
                // For now, if empty, we might show empty state.
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mock data for fallback if DB is empty (Optional: Remove before production if strict)
    const mockPosts: Post[] = [
        { id: "1", title: "The Architecture of Silence", date: "2025.04.12", category: "Essay" },
        { id: "2", title: "In Conversation: Sofia Lora", date: "2025.03.28", category: "Interview" },
        { id: "3", title: "Notes on Tropical Entropy", date: "2025.03.15", category: "Research" },
        { id: "4", title: "Archive as Method", date: "2025.02.10", category: "Theory" }
    ];

    const displayPosts = posts.length > 0 ? posts : mockPosts;

    return (
        <div className="w-full">
            <ScrollRevealText
                text="Journal"
                className="text-[12vw] leading-[0.8] tracking-tighter text-[#002FA7] mix-blend-multiply mb-12"
                el="h1"
            />

            <div className="border-t border-[#002FA7]">
                {loading && posts.length === 0 ? (
                    <div className="py-24 text-center font-mono text-sm text-[#002FA7] animate-pulse">Loading Journal...</div>
                ) : (
                    <StaggeredGrid staggerDelay={0.05}>
                        {displayPosts.map((post, i) => (
                            <Link href={`/blog/${post.id}`} key={post.id || i} className="group block">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline py-8 border-b border-[#002FA7] hover:bg-[#002FA7] hover:text-white transition-colors duration-300 px-0 md:px-4 -mx-0 md:-mx-4 cursor-pointer">
                                    <div className="flex flex-col md:flex-row gap-2 md:gap-12 md:items-baseline w-3/4">
                                        <span className="font-mono text-xs uppercase opacity-50 w-24 flex-shrink-0 group-hover:opacity-80">{post.date}</span>
                                        <h2 className="text-2xl md:text-3xl group-hover:translate-x-4 transition-transform duration-300">{post.title}</h2>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                                        <span className="font-mono text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100">{post.category}</span>
                                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </StaggeredGrid>
                )}
            </div>

            <div className="py-24 flex justify-center">
                <button className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-8 py-4 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors">
                    Load More Archives
                </button>
            </div>
        </div>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogPageContent />
        </Suspense>
    );
}
