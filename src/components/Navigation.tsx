"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MenuLink {
    label: string;
    href: string;
}

interface MenuColumn {
    id: string;
    title: string;
    links: MenuLink[];
}

const defaultMenu: MenuColumn[] = [
    {
        id: "about",
        title: "About",
        links: [
            { label: "Mission", href: "/mission" },
            { label: "Team", href: "/team" },
            { label: "History", href: "/about" }
        ]
    },
    {
        id: "programs",
        title: "Programs",
        links: [
            { label: "Events", href: "/events" },
            { label: "Exhibitions", href: "/events" },
            { label: "Research", href: "/events" }
        ]
    },
    {
        id: "involve",
        title: "Get Involved",
        links: [
            { label: "Mailing List", href: "/info" },
            { label: "Contact", href: "/info" },
            { label: "Admin", href: "/admin" }
        ]
    }
];

export default function Navigation({ onClose }: { onClose: () => void }) {
    const [columns, setColumns] = useState<MenuColumn[]>(defaultMenu);

    useEffect(() => {
        const fetchNav = async () => {
            try {
                const docRef = doc(db, "content", "navigation");
                const snap = await getDoc(docRef);
                if (snap.exists() && snap.data().columns) {
                    setColumns(snap.data().columns);
                }
            } catch (error) {
                console.error("Error fetching navigation:", error);
            }
        };
        fetchNav();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 flex flex-col items-center justify-center p-4"
        >
            <nav className={`w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-${Math.min(columns.length, 4)} gap-12 p-8 text-left h-full items-start pt-32`}>

                {columns.map((col) => (
                    <div key={col.id} className="flex flex-col gap-6">
                        <h3 className="text-zinc-500 font-mono text-sm uppercase mb-4 border-b border-zinc-800 pb-2">
                            {col.title}
                        </h3>
                        {col.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.href}
                                onClick={onClose}
                                className="text-3xl font-bold uppercase hover:text-zinc-400 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Decorative details */}
            <div className="absolute bottom-8 left-8 text-xs md:text-sm text-gray-500 font-mono">
                EST. 2026 — D.R.
            </div>
            <div className="absolute bottom-8 right-8 text-xs md:text-sm text-gray-500 font-mono text-right">
                NARRATIVA<br />ALTERNATIVA
            </div>
        </motion.div>
    );
}
