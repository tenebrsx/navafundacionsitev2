"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutGrid, List, ArrowUpRight } from "lucide-react";
import StaggeredGrid from "@/components/anim/StaggeredGrid";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import MagneticButton from "@/components/anim/MagneticButton";

// Fake Data for Content
const projects = [
    {
        id: 1,
        title: "Echoes of the Unseen",
        type: "Exhibition",
        year: "2025",
        description: "A curatorial exploration of silence and space in post-digital Caribbean aesthetics.",
        image: "bg-[#E5E5E0]" // Placeholder color
    },
    {
        id: 2,
        title: "Tropical Modernism Revisited",
        type: "Research",
        year: "2024",
        description: "Archiving the architectural heritage of Santo Domingo through a contemporary lens.",
        image: "bg-[#D4D4D0]"
    },
    {
        id: 3,
        title: "Zona Maco: Nava Presentation",
        type: "Art Fair",
        year: "2024",
        description: "Solo presentation of emerging artist Sofia Lora at Mexico City's premier art fair.",
        image: "bg-[#002FA7]/10"
    },
    {
        id: 4,
        title: "The Garden of Forking Paths",
        type: "Public Program",
        year: "2023",
        description: "A series of site-specific performances in the Botanical Gardens.",
        image: "bg-[#F0F0F0]"
    },
    {
        id: 5,
        title: "Printed Matter: Narratives",
        type: "Publication",
        year: "2023",
        description: "Launch of our first annual journal focusing on text-based art practices.",
        image: "bg-[#E0E0E0]"
    },
    {
        id: 6,
        title: "Digital Diaspora",
        type: "Online Exhibition",
        year: "2023",
        description: "Web-based works by 5 diasporic Dominican artists.",
        image: "bg-[#002FA7]/5"
    }
];

export default function ProjectsPage() {
    const [view, setView] = useState<"grid" | "list">("grid");

    return (
        <div className="w-full">
            {/* Header with Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-24 gap-6 md:gap-0">
                <ScrollRevealText
                    text="Projects"
                    className="text-[12vw] leading-[0.8] tracking-tighter text-[#002FA7] mix-blend-multiply"
                    el="h1"
                />

                <div className="flex items-center gap-4">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 hidden md:block">View Mode</span>
                    <div className="flex gap-2 border border-[#002FA7] p-1 rounded-full">
                        <button
                            onClick={() => setView("grid")}
                            className={`p-2 rounded-full transition-colors ${view === "grid" ? "bg-[#002FA7] text-white" : "text-[#002FA7] hover:bg-[#002FA7]/10"}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`p-2 rounded-full transition-colors ${view === "list" ? "bg-[#002FA7] text-white" : "text-[#002FA7] hover:bg-[#002FA7]/10"}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Rendering */}
            {view === "grid" ? (
                <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-24" staggerDelay={0.05}>
                    {projects.map((project) => (
                        <div key={project.id} className="group cursor-pointer flex flex-col gap-4">
                            {/* Image Area */}
                            <div className={`w-full aspect-[4/3] ${project.image} relative overflow-hidden border border-[#002FA7]/10`}>
                                <div className="absolute inset-0 bg-[#002FA7]/0 group-hover:bg-[#002FA7]/5 transition-colors duration-500"></div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white text-[#002FA7] p-2 rounded-full shadow-sm">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-baseline border-b border-[#002FA7]/20 pb-2">
                                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">{project.type}</span>
                                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">{project.year}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl text-[#002FA7] leading-tight group-hover:underline decoration-1 underline-offset-4">
                                    {project.title}
                                </h2>
                                <p className="text-sm leading-relaxed opacity-80 max-w-sm">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </StaggeredGrid>
            ) : (
                <div className="border-t border-[#002FA7]">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03, duration: 0.4 }}
                            className="group flex flex-col md:flex-row justify-between items-start md:items-center py-6 md:py-8 border-b border-[#002FA7] hover:bg-[#002FA7] hover:text-white px-0 md:px-4 transition-colors cursor-pointer -mx-0 md:-mx-4"
                        >
                            <div className="flex flex-col md:flex-row gap-2 md:gap-12 md:items-baseline w-1/2">
                                <span className="font-mono text-xs uppercase opacity-50 group-hover:opacity-80 w-24 flex-shrink-0">{project.year}</span>
                                <h2 className="text-xl md:text-3xl leading-tight">{project.title}</h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 md:items-center mt-4 md:mt-0 w-1/2 md:justify-end">
                                <span className="font-mono text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100 w-32 text-right hidden md:block">{project.type}</span>
                                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
