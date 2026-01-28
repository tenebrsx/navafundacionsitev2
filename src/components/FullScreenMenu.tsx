"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/anim/MagneticButton";

interface FullScreenMenuProps {
    onClose: () => void;
}

const menuVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }
    }
};

const linkContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const linkVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }
    }
};

export default function FullScreenMenu({ onClose }: FullScreenMenuProps) {
    const links = [
        { label: "Homepage", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "Team", href: "/team" },
        { label: "Blog", href: "/blog" },
        { label: "Events", href: "/events" },
        { label: "Our Story", href: "/story" },
    ];

    const socials = [
        { label: "Instagram", href: "#" },
        { label: "Twitter", href: "#" },
        { label: "LinkedIn", href: "#" },
    ];

    return (
        <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-[#002FA7] text-white flex flex-col p-6 md:p-12"
        >
            {/* Header of the Menu */}
            <div className="flex justify-between items-center w-full">
                <div className="text-sm font-mono uppercase tracking-widest opacity-60">
                    Navigation
                </div>
                <MagneticButton>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 uppercase tracking-widest text-sm group"
                    >
                        <span>Close</span>
                        <div className="bg-white text-[#002FA7] rounded-full p-1 group-hover:scale-110 transition-transform">
                            <X size={20} />
                        </div>
                    </button>
                </MagneticButton>
            </div>

            {/* Main Links */}
            <div className="flex-grow flex flex-col justify-center">
                <motion.nav
                    variants={linkContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-4 md:gap-8"
                >
                    {links.map((link, i) => (
                        <motion.div key={i} variants={linkVariants}>
                            <Link
                                href={link.href}
                                onClick={onClose}
                                className="text-4xl md:text-7xl font-bold uppercase tracking-tighter hover:text-white/70 transition-colors flex items-center gap-4 group"
                            >
                                <span className="opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-base md:text-xl font-mono align-middle">
                                    0{i + 1}
                                </span>
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </motion.nav>
            </div>

            {/* Footer / Socials */}
            <div className="flex justify-between items-end border-t border-white/20 pt-8">
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-xs uppercase opacity-50">Socials</span>
                    <div className="flex gap-6">
                        {socials.map((s) => (
                            <a key={s.label} href={s.href} className="text-sm uppercase tracking-wider hover:opacity-70 flex items-center gap-1">
                                {s.label} <ArrowUpRight size={14} className="opacity-50" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="text-right font-mono text-xs uppercase opacity-50">
                    Nava Fundacion © 2025
                </div>
            </div>
        </motion.div>
    );
}
