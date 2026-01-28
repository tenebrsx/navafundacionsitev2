"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const projects = [
    {
        id: "01",
        title: "Liquid Grounds",
        category: "Exhibition",
        image: "https://images.unsplash.com/photo-1544207240-2780459da485?auto=format&fit=crop&q=80&w=2800",
        cols: "md:col-span-8",
        aspect: "aspect-[4/3]"
    },
    {
        id: "02",
        title: "Silent Architecture",
        category: "Research",
        image: "https://images.unsplash.com/photo-1518640165980-d3e0e2aa2c19?auto=format&fit=crop&q=80&w=2800",
        cols: "md:col-span-4",
        aspect: "aspect-[3/4]"
    }
];

export default function ProjectShowcase() {
    return (
        <section className="px-4 md:px-6 max-w-[1400px] mx-auto pb-40 text-[#002FA7]">
            <div className="mb-8 flex justify-between items-end border-b border-[#002FA7]/20 pb-4">
                <span className="text-sm opacity-50">(01) Works & Activity</span>
                <Link href="/programs" className="text-sm hover:underline">View All →</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                {projects.map((project) => (
                    <div key={project.id} className={`${project.cols} group cursor-pointer`}>
                        <div className={`relative w-full ${project.aspect} bg-[#002FA7]/5 overflow-hidden mb-4`}>
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
                            <span className="text-xs opacity-50">{project.category}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Journal List Teaser */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 text-4xl font-bold tracking-tight leading-none">
                    Latest from<br />the Journal
                </div>
                <div className="md:col-span-8 flex flex-col">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border-t border-[#002FA7]/20 py-6 flex justify-between items-center group cursor-pointer hover:bg-[#002FA7]/5 px-2 transition-colors">
                            <div>
                                <h4 className="text-xl font-medium">Conversations on Caribbean Entropy</h4>
                                <p className="text-sm opacity-50 mt-1">An essay by Sofia M.</p>
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
