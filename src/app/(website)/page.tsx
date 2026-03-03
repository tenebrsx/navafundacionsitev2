"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/anim/MagneticButton";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import NavaLogoRef from "@/components/anim/NavaLogoRef";
import HomePrograms from "@/components/HomePrograms";

import HomeExhibition from "@/components/HomeExhibition";
import HomeCatalog from "@/components/HomeCatalog";
import HomeJournal from "@/components/HomeJournal";

export default function Home() {
    const { scrollY } = useScroll();
    const logoY = useTransform(scrollY, [0, 300], [0, 50]);

    return (
        <div className="w-full">

            {/* Hero Section */}
            <section className="sticky top-0 z-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden border-b border-[#002FA7]">

                <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 w-full">
                    <NavaLogoRef />
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

                {/* Catalog Carousel */}
                <HomeCatalog />

                {/* Journal */}
                <HomeJournal />

                {/* Programs List */}
                <HomePrograms />

            </div>
        </div>
    );
}
