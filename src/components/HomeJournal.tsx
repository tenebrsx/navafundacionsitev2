"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/anim/MagneticButton";
import Image from "next/image";

export default function HomeJournal() {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const q = query(
                    collection(db, "posts"),
                    orderBy("date", "desc"),
                    limit(1)
                );
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    setPost({
                        id: snapshot.docs[0].id,
                        ...snapshot.docs[0].data(),
                    });
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, []);

    // Skeleton while loading
    if (loading || !post) {
        return (
            <div className="py-12 md:py-24 border-b border-[#002FA7] flex flex-col md:flex-row-reverse gap-8 md:gap-12 px-4 sm:px-12 md:px-24">
                <div className="w-full md:w-1/3 flex flex-col items-end gap-4">
                    <span className="font-mono text-xs uppercase tracking-widest block opacity-50">Journal</span>
                    <div className="h-10 w-3/4 bg-[#002FA7]/5 animate-pulse"></div>
                </div>
                <div className="w-full md:w-2/3 h-[300px] md:h-[400px] bg-[#F0F0F0] animate-pulse border border-[#002FA7]/10"></div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-24 border-b border-[#002FA7] flex flex-col md:flex-row-reverse gap-8 md:gap-12 px-4 sm:px-12 md:px-24">
            <div className="w-full md:w-1/3 flex flex-col justify-between text-right items-end">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest block mb-4 opacity-50">Journal</span>
                    <h2 className="text-3xl md:text-4xl text-[#002FA7] line-clamp-2">
                        {post.title}
                    </h2>
                </div>
                <MagneticButton>
                    <Link href={`/blog/${post.id}`} className="flex items-center gap-2 group mt-8">
                        <span className="uppercase tracking-widest text-xs font-bold text-[#002FA7] group-hover:underline decoration-1 underline-offset-4">Read Article</span>
                        <ArrowUpRight size={16} className="text-[#002FA7]" />
                    </Link>
                </MagneticButton>
            </div>

            <div className="w-full md:w-2/3 h-[300px] md:h-[400px] bg-[#F0F0F0] relative flex items-center justify-center border border-[#002FA7]/10 overflow-hidden">
                {post.image || post.imageUrl ? (
                    <Image
                        src={post.image || post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-contain p-4 md:p-8 hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <span className="font-mono text-xs opacity-30 text-[#002FA7]">Editorial Image Placeholder</span>
                )}
            </div>
        </div>
    );
}
