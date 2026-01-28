"use client";

import StaggeredGrid from "@/components/anim/StaggeredGrid";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import { ArrowUpRight } from "lucide-react";

// Mock Data for Team
const team = [
    {
        name: "Elena Rossi",
        role: "Founding Director",
        bio: "Former curator at Museo de Arte Moderno with a focus on Caribbean archipelagic thought.",
        image: "bg-[#D4D4D0]"
    },
    {
        name: "David Mendez",
        role: "Architecture & Design",
        bio: "Specializing in tropical modernism and sustainable exhibition spaces.",
        image: "bg-[#E5E5E0]"
    },
    {
        name: "Sarah Jean-Baptiste",
        role: "Head of Research",
        bio: "PhD candidate exploring digital diasporas and vernacular archives.",
        image: "bg-[#F0F0F0]"
    },
    {
        name: "Luis Castillo",
        role: "Program Coordinator",
        bio: "Connecting local artist communities with international residency programs.",
        image: "bg-[#002FA7]/10"
    }
];

export default function TeamPage() {
    return (
        <div className="w-full">
            <ScrollRevealText
                text="Team"
                className="text-[12vw] leading-[0.8] font-serif tracking-tighter text-[#002FA7] mix-blend-multiply mb-12 md:mb-24"
                el="h1"
            />

            <div className="flex flex-col gap-12 md:gap-24">

                {/* Introduction / Statement */}
                <div className="max-w-2xl text-lg md:text-2xl leading-relaxed font-serif text-[#002FA7] border-b border-[#002FA7] pb-12">
                    <p>
                        Our team constitutes a collective of curators, researchers, and architects dedicated to rewriting the narrative of Caribbean art from the inside out.
                    </p>
                </div>

                {/* Team Grid */}
                <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16" staggerDelay={0.1}>
                    {team.map((member, i) => (
                        <div key={i} className="group flex flex-col gap-6 cursor-pointer">
                            {/* Image Placeholder */}
                            <div className={`w-full aspect-[3/4] md:aspect-[4/5] ${member.image} relative overflow-hidden border border-[#002FA7]/10`}>
                                <div className="absolute inset-0 bg-[#002FA7]/0 group-hover:bg-[#002FA7]/10 transition-colors duration-500"></div>
                                {/* Initial of First Name as placeholder graphic */}
                                <div className="absolute bottom-4 left-4 text-[10vw] md:text-[8vw] font-serif text-[#002FA7] leading-none opacity-10 group-hover:opacity-20 transition-opacity">
                                    {member.name.charAt(0)}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-baseline border-b border-[#002FA7]/20 pb-2">
                                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">{member.role}</span>
                                    <ArrowUpRight size={16} className="text-[#002FA7] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h2 className="text-3xl font-serif text-[#002FA7]">{member.name}</h2>
                                <p className="text-sm leading-relaxed opacity-80 max-w-sm mt-2">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </StaggeredGrid>

                {/* Advisory Board List (Simple) */}
                <div className="flex flex-col gap-8 pt-12">
                    <h3 className="font-mono text-xs uppercase tracking-widest opacity-60">Advisory Board</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#002FA7] pt-8">
                        {["Dr. Alanna Heiss", "Hans Ulrich Obrist", "Mariana Yampolsky"].map((name, i) => (
                            <div key={i} className="text-xl font-serif text-[#002FA7]">{name}</div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
