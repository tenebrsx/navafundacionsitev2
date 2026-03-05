"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2 } from "lucide-react";
import MagneticButton from "./anim/MagneticButton";

interface Post {
    id: string;
    title: string;
    date: string;
    category: string;
    content?: string;
    image?: string;
    imageUrl?: string;
    author?: string;
}

interface BlogPostDetailProps {
    post: Post;
    relatedPosts?: Post[];
}

export default function BlogPostDetail({ post, relatedPosts = [] }: BlogPostDetailProps) {
    return (
        <article className="min-h-screen text-[#002FA7]">
            {/* Centered editorial column */}
            <div className="max-w-3xl mx-auto">

                {/* Top nav bar */}
                <div className="flex justify-between items-center mb-16">
                    <MagneticButton>
                        <Link href="/blog" className="flex items-center gap-2 group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-xs uppercase tracking-widest">Back to Journal</span>
                        </Link>
                    </MagneticButton>
                    <MagneticButton>
                        <button className="p-2 border border-[#002FA7] rounded-full hover:bg-[#002FA7] hover:text-[#F4F4F2] transition-colors">
                            <Share2 size={16} />
                        </button>
                    </MagneticButton>
                </div>

                {/* Centered header */}
                <header className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-widest opacity-60 mb-6">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.category}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl leading-[0.95] tracking-tighter mb-4">
                        {post.title}
                    </h1>
                    {post.author && (
                        <div className="font-mono text-sm uppercase opacity-60 mt-6">
                            By {post.author}
                        </div>
                    )}
                </header>

                {/* Divider */}
                <div className="w-16 h-px bg-[#002FA7]/30 mx-auto mb-12"></div>

                {/* Hero Image — constrained inside the column */}
                {(post.image || post.imageUrl) && (
                    <div className="w-full aspect-[3/2] mb-16 overflow-hidden relative rounded-sm bg-[#E5E5E0]">
                        <Image
                            src={(post.image || post.imageUrl)!}
                            alt={post.title}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority
                        />
                    </div>
                )}

                {/* Article Content — editorial prose */}
                <div
                    className="editorial-prose"
                    dangerouslySetInnerHTML={{ __html: post.content || '<p class="opacity-50 italic">[No content available]</p>' }}
                />
            </div>

            {/* ── Read Next — breaks out of narrow column ── */}
            {relatedPosts.length > 0 && (
                <div className="border-t border-[#002FA7] pt-12 mt-20 max-w-5xl mx-auto">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-8 text-center">More from the Journal</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.slice(0, 3).map(p => (
                            <Link href={`/blog/${p.id}`} key={p.id} className="group flex flex-col gap-4 cursor-pointer">
                                {p.image || p.imageUrl ? (
                                    <div className="w-full aspect-[4/3] overflow-hidden bg-zinc-100 relative">
                                        <Image
                                            src={(p.image || p.imageUrl)!}
                                            alt={p.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[4/3] bg-[#002FA7]/5 flex items-center justify-center font-mono text-xs opacity-50 border border-[#002FA7]/20 group-hover:bg-[#002FA7]/10 transition-colors">
                                        Nava Journal
                                    </div>
                                )}
                                <div className="flex flex-col gap-2 pt-4 border-t border-[#002FA7]">
                                    <div className="flex justify-between items-baseline font-mono text-xs uppercase opacity-60">
                                        <span>{p.date}</span>
                                        {p.category && <span>{p.category}</span>}
                                    </div>
                                    <h3 className="text-xl md:text-2xl leading-[1.1] group-hover:underline decoration-1 underline-offset-4">
                                        {p.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ── End of Article CTA ── */}
            <div className="text-center mt-20 mb-8">
                <Link
                    href="/blog"
                    className="inline-block font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-8 py-4 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors"
                >
                    ← Back to Journal
                </Link>
            </div>
        </article>
    );
}
