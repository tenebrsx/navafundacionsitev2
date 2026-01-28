"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const programs = [
    {
        id: "01",
        title: "Liquid Grounds",
        category: "Exhibition",
        date: "Current",
        image: "https://images.unsplash.com/photo-1544207240-2780459da485?auto=format&fit=crop&q=80&w=2800",
        aspect: "aspect-[4/3]"
    },
    {
        id: "02",
        title: "Silent Architecture",
        category: "Research",
        date: "2025",
        image: "https://images.unsplash.com/photo-1518640165980-d3e0e2aa2c19?auto=format&fit=crop&q=80&w=2800",
        aspect: "aspect-[3/4]"
    },
    {
        id: "03",
        title: "Caribbean Entropy",
        category: "Publication",
        date: "Upcoming",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2800",
        aspect: "aspect-square"
    },
    {
        id: "04",
        title: "Material Memory",
        category: "Workshop",
        date: "2025",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2800",
        aspect: "aspect-video"
    }
];

export default function ProgramsPage() {
    return (
        <div className="min-h-screen bg-white text-[#002FA7] pt-32 pb-24 px-4 md:px-6 font-sans">
            <header className="max-w-[1400px] mx-auto mb-24">
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] -ml-1 mb-8">
                    Programs
                </h1>
                <div className="flex gap-4 font-medium">
                    <button className="bg-[#002FA7] text-white px-4 py-1 rounded-full text-sm">All</button>
                    <button className="border border-[#002FA7] px-4 py-1 rounded-full text-sm hover:bg-[#002FA7]/5">Exhibitions</button>
                    <button className="border border-[#002FA7] px-4 py-1 rounded-full text-sm hover:bg-[#002FA7]/5">Research</button>
                </div>
            </header>

            <section className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                {programs.map((program, i) => (
                    <div key={program.id} className={`group cursor-pointer ${i % 3 === 0 ? 'lg:col-span-8' : 'lg:col-span-4'}`}>
                        <div className={`relative w-full ${program.aspect} bg-[#002FA7]/5 overflow-hidden mb-4`}>
                            <Image
                                src={program.image}
                                alt={program.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#002FA7] text-xs px-2 py-1 uppercase tracking-widest">
                                {program.date}
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">{program.title}</h3>
                                <span className="text-sm opacity-50">{program.category}</span>
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
