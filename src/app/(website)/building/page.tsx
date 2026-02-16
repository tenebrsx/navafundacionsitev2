"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/anim/MagneticButton";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import NavMorphLogo from "@/components/anim/NavMorphLogo";
import HomePrograms from "@/components/HomePrograms";

import HomeExhibition from "@/components/HomeExhibition";
import HomeJournal from "@/components/HomeJournal";

export default function Home() {
    const { scrollY } = useScroll();
    const logoY = useTransform(scrollY, [0, 300], [0, 50]);

    return (
        <div className="w-full">

            {/* Hero Section: The Building Animation (Parallax/Sticky) */}
            <section className="sticky top-0 z-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden border-b border-[#002FA7]">

                <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 w-full">
                    <div className="w-[80vw] md:w-[50vw]">
                        <NavMorphLogo />
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#002FA7] uppercase font-bold"
                        >
                            Narrativa Alternativa
                        </motion.span>
                        <MagneticButton>
                            <Link href="/story" className="flex items-center gap-2 group mt-4">
                                <span className="uppercase tracking-widest text-xs font-bold text-[#002FA7] group-hover:underline decoration-1 underline-offset-4">Enter Archive</span>
                                <ArrowRight size={14} className="text-[#002FA7]" />
                            </Link>
                        </MagneticButton>
                    </div>
                </div>

                <div className="absolute bottom-8 left-0 w-full flex justify-between px-4 sm:px-12 md:px-24">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Santo Domingo, DR</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Est. 2024</span>
                </div>
            </section>

            {/* Content Stream: Curtain Effect */}
            <div className="relative z-10 bg-[#F4F4F2] flex flex-col w-full border-t border-[#002FA7]">

                {/* Current Exhibition */}
                <HomeExhibition />

                {/* Journal */}
                <HomeJournal />

                {/* Programs List */}
                <HomePrograms />

            </div>
        </div>
    );
}
