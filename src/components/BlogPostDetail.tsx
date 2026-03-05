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
            {/* Header / Meta */}
            <div className="mb-12 border-b border-[#002FA7] pb-12">
                <div className="flex justify-between items-start mb-8">
                    <MagneticButton>
                        <Link href="/blog" className="flex items-center gap-2 group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-xs uppercase tracking-widest">Back to Journal</span>
                        </Link>
                    </MagneticButton>
                    <div className="flex gap-4">
                        <MagneticButton>
                            <button className="p-2 border border-[#002FA7] rounded-full hover:bg-[#002FA7] hover:text-[#F4F4F2] transition-colors">
                                <Share2 size={16} />
                            </button>
                        </MagneticButton>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest opacity-60">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.category}</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl leading-[0.9] tracking-tighter max-w-4xl">
                        {post.title}
                    </h1>
                    {post.author && (
                        <div className="font-mono text-sm uppercase opacity-80 mt-4">
                            By {post.author}
                        </div>
                    )}
                </div>
            </div>

            {/* Hero Image — full width at the top */}
            {(post.image || post.imageUrl) && (
                <div className="w-full aspect-[4/3] md:aspect-[3/2] mb-12 border border-[#002FA7]/10 overflow-hidden relative bg-[#E5E5E0]">
                    <Image
                        src={(post.image || post.imageUrl)!}
                        alt={post.title}
                        fill
                        className="object-cover object-top md:object-center"
                        sizes="100vw"
                        priority
                    />
                </div>
            )}

            {/* Article Content */}
            <div className="max-w-3xl">
                <div
                    className="prose prose-lg prose-headings:font-normal prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-[#002FA7] prose-p:leading-relaxed prose-headings:text-[#002FA7] max-w-none font-sans"
                    dangerouslySetInnerHTML={{ __html: post.content || '<p class="opacity-50 italic">[No content available]</p>' }}
                />
            </div>

            {/* Read Next */}
            {relatedPosts.length > 0 && (
                <div className="border-t border-[#002FA7] pt-8 mt-16">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-6">Read Next</span>
                    <div className="flex flex-col gap-6">
                        {relatedPosts.map(p => (
                            <Link href={`/blog/${p.id}`} key={p.id} className="group block">
                                <span className="font-mono text-xs opacity-50 block mb-1">{p.date}</span>
                                <h3 className="text-xl leading-tight group-hover:underline underline-offset-4 decoration-1">
                                    {p.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
