"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Hardcoded for now to match the "Editorial" design proposal
const editorialMenu = [
    { label: "INDEX", href: "/" },
    { label: "JOURNAL", href: "/journal" },
    { label: "ARCHIVE", href: "/archive" },
    { label: "MANIFESTO", href: "/manifesto" },
    { label: "PROGRAMS", href: "/programs" },
    { label: "VISIT", href: "/visit" },
];

export default function Navigation({ onClose }: { onClose: () => void }) {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#002FA7] text-white flex flex-col p-4 md:p-6"
        >
            {/* Background Grain/Grid could be added here */}

            <div className="flex-1 flex flex-col justify-center items-center">
                <nav className="flex flex-col items-center gap-4 md:gap-6">
                    {editorialMenu.map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            onClick={onClose}
                            className="text-5xl md:text-8xl font-bold uppercase tracking-tighter hover:text-white/50 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/20 pt-6 font-mono text-xs uppercase tracking-widest">
                <div>
                    <h4 className="opacity-50 mb-2">Social</h4>
                    <ul className="flex flex-col gap-1">
                        <li><a href="#" className="hover:underline">Instagram</a></li>
                        <li><a href="#" className="hover:underline">Twitter</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="opacity-50 mb-2">Contact</h4>
                    <p>info@nava.org</p>
                </div>
                <div className="hidden md:block text-right opacity-50">
                    NARRATIVA ALTERNATIVA © 2026
                </div>
            </div>
        </motion.div>
    );
}
