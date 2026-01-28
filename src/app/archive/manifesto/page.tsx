"use client";

import { motion } from "framer-motion";

export default function ManifestoPage() {
    return (
        <div className="min-h-screen bg-white text-[#002FA7] pt-32 pb-24 px-4 md:px-6 font-sans">
            <header className="max-w-[1400px] mx-auto mb-24 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-8">
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] -ml-1">
                        We are building<br />
                        the infrastructure<br />
                        for the next<br />
                        generation.
                    </h1>
                </div>
                <div className="md:col-span-4 flex items-end">
                    <p className="text-lg leading-relaxed opacity-80">
                        Nava Fundacion is a non-profit organization dedicated to the research, preservation, and promotion of contemporary art in the Dominican Republic and the Caribbean.
                    </p>
                </div>
            </header>

            <section className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[#002FA7]/20 pt-24">

                {/* Column 1: History */}
                <div className="md:col-span-4 flex flex-col gap-8">
                    <span className="text-sm opacity-50 uppercase tracking-widest">(01) History</span>
                    <p className="leading-relaxed">
                        Founded in 2024, Nava emerged from a need to document the rapidly evolving art scene in Santo Domingo. What began as a digital archive has grown into a physical platform for exhibitions and critical discourse.
                    </p>
                </div>

                {/* Column 2: Mission */}
                <div className="md:col-span-4 flex flex-col gap-8">
                    <span className="text-sm opacity-50 uppercase tracking-widest">(02) Mission</span>
                    <p className="leading-relaxed">
                        We aim to challenge established historical canons by centering narratives that have been overlooked. Our "living archive" methodology treats documentation as an active, creative process rather than a static record.
                    </p>
                </div>

                {/* Column 3: Team */}
                <div className="md:col-span-4 flex flex-col gap-8">
                    <span className="text-sm opacity-50 uppercase tracking-widest">(03) Team</span>
                    <ul className="flex flex-col gap-4">
                        <li className="flex justify-between border-b border-[#002FA7]/10 pb-2">
                            <span>Sofia M.</span>
                            <span className="opacity-50">Director</span>
                        </li>
                        <li className="flex justify-between border-b border-[#002FA7]/10 pb-2">
                            <span>Carlos R.</span>
                            <span className="opacity-50">Curator</span>
                        </li>
                        <li className="flex justify-between border-b border-[#002FA7]/10 pb-2">
                            <span>Elena V.</span>
                            <span className="opacity-50">Head of Research</span>
                        </li>
                    </ul>
                </div>

            </section>
        </div>
    );
}
