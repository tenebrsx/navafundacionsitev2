"use client";

import { motion } from "framer-motion";

export default function IntroSection() {
    return (
        <section className="pt-40 pb-24 px-4 md:px-6 max-w-[1400px] mx-auto text-[#002FA7]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12">

                {/* Left: Branding Arrow */}
                <div className="hidden md:block md:col-span-1">
                    <span className="text-2xl">→</span>
                </div>

                {/* Title */}
                <div className="md:col-span-11 lg:col-span-5">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] -ml-1">
                        Navigating<br />
                        Narratives
                    </h1>
                </div>

                {/* Right: Asymmetrical Content Info */}
                <div className="md:col-span-12 lg:col-span-5 lg:col-start-8 flex flex-col gap-12 mt-12 lg:mt-0">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                        <div>
                            <h3 className="opacity-50 mb-2">Who We Are</h3>
                            <p className="leading-relaxed">
                                Nava Fundacion is a research institute and curatorial platform based in Santo Domingo. We examine the intersection of Caribbean identity and contemporary art.
                            </p>
                        </div>
                        <div>
                            <h3 className="opacity-50 mb-2">Our Focus</h3>
                            <p className="leading-relaxed">
                                Through exhibitions, publications, and archival work, we aim to document the "unwritten" histories of the region.
                            </p>
                        </div>
                    </div>

                    <div className="text-xl md:text-2xl leading-normal font-medium tracking-tight">
                        "We blur the boundary between clarity and suggestion, leaving room for brands to grow into their future selves."
                        <br />
                        <span className="opacity-40 text-base mt-2 block">— Reformulated for Nava context</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
