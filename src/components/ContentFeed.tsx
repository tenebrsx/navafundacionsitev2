"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface FeedItem {
    id: string;
    type: "JOURNAL" | "EXHIBITION" | "NEWS";
    title: string;
    date: string;
    category?: string;
    description: string;
    href: string;
}

const mockFeed: FeedItem[] = [
    {
        id: "1",
        type: "JOURNAL",
        title: "The Architecture of Silence",
        date: "JAN 24, 2026",
        category: "CRITICISM",
        description: "Exploring the void in contemporary Dominican sculpture through the lens of post-tropical minimalism.",
        href: "/journal/architecture-of-silence"
    },
    {
        id: "2",
        type: "EXHIBITION",
        title: "Liquid Grounds",
        date: "FEB 10 — MAR 20",
        description: "A group show featuring 12 emerging artists working with fluid dynamics and digital erosion.",
        href: "/programs/liquid-grounds"
    },
    {
        id: "3",
        type: "NEWS",
        title: "Call for Research Fellows: 2026",
        date: "JAN 15, 2026",
        description: "Applications are now open for the Spring 2026 archiving residency.",
        href: "/news/fellowship-2026"
    },
    {
        id: "4",
        type: "JOURNAL",
        title: "Studio Visit: Elena V...",
        date: "JAN 02, 2026",
        category: "INTERVIEW",
        description: "In conversation with the artist about her recent shift to large-scale textile installations.",
        href: "/journal/elena-v"
    }
];

export default function ContentFeed() {
    return (
        <section className="px-4 md:px-6 max-w-7xl mx-auto pb-24">

            <div className="flex items-center justify-between border-b border-[#002FA7] pb-4 mb-8">
                <h2 className="font-mono text-sm uppercase tracking-widest text-[#002FA7]">Latest Updates</h2>
                <div className="font-mono text-xs text-[#002FA7]">
                    Processing...
                </div>
            </div>

            <div className="grid grid-cols-1 gap-0 border-t border-[#002FA7]/20">
                {mockFeed.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group border-b border-[#002FA7]/20 py-8 hover:bg-[#002FA7]/5 transition-colors cursor-pointer"
                    >
                        <Link href={item.href} className="flex flex-col md:flex-row gap-4 md:gap-12 items-baseline">
                            {/* Meta */}
                            <div className="w-full md:w-32 flex-shrink-0 font-mono text-xs text-[#002FA7]/60 uppercase">
                                <div>{item.type}</div>
                                <div className="mt-1">{item.date}</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-baseline gap-4 mb-2">
                                    <h3 className="text-2xl md:text-4xl font-bold text-[#002FA7] uppercase leading-none group-hover:indent-4 transition-all font-serif">
                                        {item.title}
                                    </h3>
                                    {item.category && (
                                        <span className="font-mono text-xs border border-[#002FA7] text-[#002FA7] px-1.5 py-0.5 rounded-full">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[#002FA7] max-w-2xl leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Action */}
                            <div className="hidden md:block w-8 text-[#002FA7] opacity-0 group-hover:opacity-100 transition-opacity">
                                →
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <Link
                    href="/journal"
                    className="font-mono text-xs uppercase tracking-widest text-[#002FA7] border-b border-[#002FA7] pb-1 hover:opacity-50"
                >
                    View Full Archive
                </Link>
            </div>
        </section>
    );
}
