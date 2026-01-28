"use client";

import { motion } from "framer-motion";

const archiveItems = [
    { year: "2026", type: "JOURNAL", title: "The Architecture of Silence", slug: "architecture-of-silence" },
    { year: "2026", type: "EVENT", title: "Liquid Grounds: Opening Reception", slug: "liquid-grounds-opening" },
    { year: "2026", type: "FELLOWSHIP", title: "Spring 2026 Cohort Announced", slug: "spring-2026-fellows" },
    { year: "2026", type: "JOURNAL", title: "Studio Visit: Elena V...", slug: "elena-v" },
    { year: "2025", type: "EXHIBITION", title: "Retrospective: 1990-2000", slug: "retrospective" },
    { year: "2025", type: "JOURNAL", title: "Review: Liquid Grounds at Km 12", slug: "liquid-grounds-review" },
    { year: "2025", type: "PRESS", title: "Nava Fundacion Launch", slug: "press-launch" },
];

export default function ArchivePage() {
    return (
        <div className="min-h-screen bg-white text-[#002FA7] pt-32 pb-24 px-4 md:px-6 font-sans">
            <header className="mb-24 max-w-7xl mx-auto">
                <h1 className="text-6xl md:text-9xl uppercase leading-[0.8] tracking-tighter mb-8">
                    Archive
                </h1>
                <div className="border-t border-[#002FA7] pt-6 flex justify-between font-mono text-xs uppercase tracking-widest">
                    <div>Full Index</div>
                    <div>{archiveItems.length} Items</div>
                </div>
            </header>

            <section className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-4 border-b border-[#002FA7] pb-2 font-mono text-xs uppercase tracking-widest mb-4 opacity-50">
                    <div className="col-span-2">Year</div>
                    <div className="col-span-3 md:col-span-2">Type</div>
                    <div className="col-span-7 md:col-span-8">Title</div>
                </div>

                {archiveItems.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="group grid grid-cols-12 gap-4 py-4 border-b border-[#002FA7]/20 hover:bg-[#002FA7] hover:text-white transition-colors cursor-pointer items-baseline"
                    >
                        <div className="col-span-2 font-mono text-sm">{item.year}</div>
                        <div className="col-span-3 md:col-span-2 font-mono text-xs border border-[#002FA7]/30 group-hover:border-white/30 rounded-full px-2 py-0.5 w-fit">
                            {item.type}
                        </div>
                        <div className="col-span-7 md:col-span-8 text-xl md:text-3xl uppercase leading-none">
                            {item.title}
                        </div>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
