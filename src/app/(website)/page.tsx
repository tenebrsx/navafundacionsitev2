"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/anim/MagneticButton";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import NavMorphLogo from "@/components/anim/NavMorphLogo";
import PulsingGrid from "@/components/anim/PulsingGrid";

export default function Home() {
    const { scrollY } = useScroll();
    const logoY = useTransform(scrollY, [0, 300], [0, 50]);

    return (
        <div className="w-full">

            {/* Hero Section: The Building Animation */}
            <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden border-b border-[#002FA7]">
                <PulsingGrid />

                <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12">
                    <div className="w-64 h-24 md:w-96 md:h-32">
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

            {/* Content Stream: Simplified Shelf Layout (No Italics) */}
            <div className="flex flex-col w-full">

                {/* Current Exhibition */}
                <div className="py-12 md:py-24 border-b border-[#002FA7] flex flex-col md:flex-row gap-8 md:gap-12 px-4 sm:px-12 md:px-24">
                    <div className="w-full md:w-1/3 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest block mb-4 opacity-50">On View</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-[#002FA7]">
                                Echoes of the Unseen
                            </h2>
                        </div>
                        <p className="mt-8 text-sm md:text-base leading-relaxed opacity-80 max-w-xs font-sans">
                            A curatorial exploration of silence and space in post-digital Caribbean aesthetics.
                        </p>
                    </div>
                    <div className="w-full md:w-2/3 h-[400px] md:h-[600px] bg-[#E5E5E0] relative overflow-hidden group border border-[#002FA7]/10">
                        <div className="absolute inset-0 bg-[#002FA7]/5 group-hover:bg-[#002FA7]/0 transition-colors duration-500"></div>
                        <div className="absolute bottom-6 right-6">
                            <MagneticButton>
                                <button className="bg-white text-[#002FA7] px-6 py-3 rounded-full uppercase text-xs tracking-widest font-bold hover:bg-[#002FA7] hover:text-white transition-colors">
                                    View Exhibition
                                </button>
                            </MagneticButton>
                        </div>
                    </div>
                </div>

                {/* Journal */}
                <div className="py-12 md:py-24 border-b border-[#002FA7] flex flex-col md:flex-row-reverse gap-8 md:gap-12 px-4 sm:px-12 md:px-24">
                    <div className="w-full md:w-1/3 flex flex-col justify-between text-right items-end">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest block mb-4 opacity-50">Journal</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-[#002FA7]">
                                Theory of Form
                            </h2>
                        </div>
                        <MagneticButton>
                            <Link href="/blog" className="flex items-center gap-2 group mt-8">
                                <span className="uppercase tracking-widest text-xs font-bold text-[#002FA7] group-hover:underline decoration-1 underline-offset-4">Read Article</span>
                                <ArrowUpRight size={16} className="text-[#002FA7]" />
                            </Link>
                        </MagneticButton>
                    </div>
                    <div className="w-full md:w-2/3 h-[300px] md:h-[400px] bg-[#F0F0F0] relative flex items-center justify-center border border-[#002FA7]/10">
                        <span className="font-mono text-xs opacity-30 text-[#002FA7]">Editorial Image Placeholder</span>
                    </div>
                </div>

                {/* Programs List */}
                <div className="py-12 md:py-24 flex flex-col px-4 sm:px-12 md:px-24">
                    <div className="mb-12 flex justify-between items-end">
                        <h2 className="font-serif text-4xl md:text-5xl text-[#002FA7]">Programs</h2>
                        <Link href="/events" className="hidden md:block uppercase tracking-widest text-xs font-bold hover:underline decoration-1 underline-offset-4 text-[#002FA7]">View Full Calendar</Link>
                    </div>

                    <div className="border-t border-[#002FA7]">
                        {[
                            { title: "Artist Residency: Summer 2025", type: "Open Call", date: "Deadline: Mar 15" },
                            { title: "Curatorial Workshop", type: "Symposium", date: "Feb 28" },
                            { title: "Cinema Paradiso Screening", type: "Film", date: "Feb 14" }
                        ].map((item, i) => (
                            <div key={i} className="group flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-[#002FA7] hover:bg-[#002FA7] hover:text-white px-0 md:px-4 transition-colors cursor-pointer -mx-0 md:-mx-4">
                                <div className="flex flex-col md:flex-row gap-2 md:gap-8 md:items-baseline">
                                    <span className="font-mono text-xs opacity-50 group-hover:opacity-80 w-24">{item.type}</span>
                                    <h3 className="text-xl md:text-2xl font-serif">{item.title}</h3>
                                </div>
                                <span className="font-mono text-xs uppercase tracking-widest mt-2 md:mt-0 opacity-60 group-hover:opacity-100">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
