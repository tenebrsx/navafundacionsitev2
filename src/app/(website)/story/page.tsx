"use client";

import { motion } from "framer-motion";
import StaggeredGrid from "@/components/anim/StaggeredGrid";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import NavMorphLogo from "@/components/anim/NavMorphLogo";

export default function StoryPage() {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-12 md:mb-24">
                <ScrollRevealText
                    text="Our Story"
                    className="text-[12vw] leading-[0.8] tracking-tighter text-[#002FA7] mix-blend-multiply"
                    el="h1"
                />
            </div>

            {/* Shelf 1: Mission Statement */}
            <div className="py-12 md:py-24 border-t border-b border-[#002FA7] flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="w-full md:w-1/3">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-4">Mission</span>
                </div>
                <div className="w-full md:w-2/3">
                    <p className="text-2xl md:text-4xl text-[#002FA7] leading-tight">
                        We are building a living archive for the future. Nava Fundacion promotes alternative narratives in art and culture, connecting the Dominican Republic with the global contemporary discourse.
                    </p>
                </div>
            </div>

            {/* Shelf 2: History & Origin (Scrolly/Staggered) */}
            <StaggeredGrid className="py-12 md:py-24 border-b border-[#002FA7] flex flex-col md:flex-row gap-8 md:gap-12" staggerDelay={0.1}>
                <div className="w-full md:w-1/2 flex flex-col gap-8 order-2 md:order-1">
                    <div className="aspect-[4/5] bg-[#E5E5E0] relative overflow-hidden border border-[#002FA7]/10 flex items-center justify-center">
                        <span className="font-mono text-xs opacity-30 tracking-widest">[Archival Image 2024]</span>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center order-1 md:order-2">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-6">Origins</span>
                    <h2 className="text-3xl md:text-4xl text-[#002FA7] mb-8">
                        From Collective to Foundation
                    </h2>
                    <p className="text-sm md:text-base leading-relaxed opacity-80 max-w-md">
                        Founded in 2024, Nava began as a series of informal conversations between artists and curators in Santo Domingo. Recognizing the need for a structured platform to document and disseminate Caribbean thought, it evolved into a foundation dedicated to the preservation of the "now."
                    </p>
                    <p className="text-sm md:text-base leading-relaxed opacity-80 max-w-md mt-6">
                        Our name, "Narrativa Alternativa," reflects our commitment to bringing marginalized or overlooked stories to the forefront of the artistic canon.
                    </p>
                </div>
            </StaggeredGrid>

            {/* Shelf 3: Vision */}
            <div className="py-12 md:py-24 flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-8 text-[#002FA7]">
                    <NavMorphLogo />
                </div>
                <h2 className="text-2xl md:text-3xl text-[#002FA7] max-w-2xl leading-relaxed">
                    "To create a space where the archive is not a dusty room, but a generator of new ideas."
                </h2>
                <span className="font-mono text-xs uppercase tracking-widest opacity-60 mt-6">- Founder's Vision</span>
            </div>

        </div>
    );
}
