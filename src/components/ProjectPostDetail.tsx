"use client";

import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import MagneticButton from "./anim/MagneticButton";

interface Project {
    id: string;
    title: string;
    type: string;
    year: string;
    description: string;
    content?: string;
    imageUrl?: string;
    location?: string;
    images?: string[]; // Array of additional images
}

interface ProjectPostDetailProps {
    project: Project;
}

export default function ProjectPostDetail({ project }: ProjectPostDetailProps) {
    return (
        <article className="min-h-screen text-[#002FA7]">
            {/* Header / Meta */}
            <div className="mb-12 border-b border-[#002FA7] pb-12">
                <div className="flex justify-between items-center mb-8">
                    <MagneticButton>
                        <Link href="/projects" className="flex items-center gap-2 group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-xs uppercase tracking-widest">Back to Projects</span>
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

                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#002FA7]/20 pt-6">
                        <div>
                            <span className="font-mono text-xs uppercase opacity-60 block">Year</span>
                            <span className="text-base">{project.year}</span>
                        </div>
                        <div>
                            <span className="font-mono text-xs uppercase opacity-60 block">Type</span>
                            <span className="text-base">{project.type}</span>
                        </div>
                        <div>
                            <span className="font-mono text-xs uppercase opacity-60 block">Location</span>
                            <span className="text-base">{project.location || "N/A"}</span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-8xl leading-[0.85] tracking-tighter max-w-6xl">
                        {project.title}
                    </h1>
                </div>
            </div>

            {/* Main Image */}
            <div className="w-full aspect-video md:aspect-[21/9] bg-zinc-100 mb-16 border border-[#002FA7]/20 relative overflow-hidden">
                {project.imageUrl && (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-24">

                {/* Description Column */}
                <div className="md:col-span-4">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-6">Overview</span>
                    <p className="text-lg leading-relaxed font-medium">
                        {project.description}
                    </p>
                </div>

                {/* Content Column */}
                <div className="md:col-span-8">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-6">Details</span>
                    <div className="prose prose-lg prose-headings:font-normal prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-[#002FA7] prose-p:leading-relaxed prose-headings:text-[#002FA7] max-w-none">
                        {project.content ? (
                            project.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-6">{paragraph}</p>
                            ))
                        ) : (
                            <p className="opacity-50 italic">Project details are being archived.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Gallery Grid (if images exist) */}
            {project.images && project.images.length > 0 && (
                <div className="space-y-12">
                    <div className="border-t border-[#002FA7] pt-4">
                        <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-6">Project Gallery</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.images.map((img, i) => (
                            <div key={i} className="aspect-[4/3] bg-zinc-100 border border-[#002FA7]/10">
                                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
