"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FileText, FolderOpen, Users, Calendar, ArrowRight, LayoutDashboard, Mail, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const { user } = useAuth();

    // Time based greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    const modules = [
        {
            title: "Journal",
            description: "Manage blog posts, articles, and press releases.",
            href: "/admin/posts",
            icon: FileText,
        },
        {
            title: "Projects",
            description: "Update portfolio projects and case studies.",
            href: "/admin/projects",
            icon: FolderOpen,
        },
        {
            title: "Team",
            description: "Edit team members, roles, and bios.",
            href: "/admin/team",
            icon: Users,
        },
        {
            title: "Events",
            description: "Schedule and manage upcoming events.",
            href: "/admin/events",
            icon: Calendar,
        },
        {
            title: "Catalog",
            description: "Manage artworks, generate QR codes for the fair.",
            href: "/admin/catalog",
            icon: Palette,
        },
        {
            title: "Subscribers",
            description: "View list of email subscribers.",
            href: "/admin/subscribers",
            icon: Mail,
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="w-full max-w-5xl">
            {/* Compact Header */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#002FA7]/40 mb-1 font-mono text-[10px] uppercase tracking-widest">
                        <LayoutDashboard size={12} />
                        <span>Dashboard</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#002FA7] tracking-tight">
                        {greeting}, <span className="opacity-50">{user?.email?.split('@')[0]}</span>
                    </h1>
                </div>
                <p className="text-[#002FA7]/40 text-xs font-medium hidden md:block">
                    Select a module to start editing.
                </p>
            </div>

            {/* 3-column Grid — fills evenly as 2 rows × 3 cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
                {modules.map((module) => (
                    <Link href={module.href} key={module.href}>
                        <motion.div
                            variants={item}
                            className="bg-white/80 p-6 rounded-xl border border-gray-200/80 hover:border-[#002FA7] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:shadow-[#002FA7]/5 transition-all duration-300 group h-full flex flex-col relative overflow-hidden"
                        >
                            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ArrowRight size={18} className="text-[#002FA7]" />
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-[#002FA7]/5 group-hover:bg-[#002FA7] flex items-center justify-center text-[#002FA7] group-hover:text-white transition-colors duration-300 shrink-0">
                                    <module.icon size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed flex-1">
                                {module.description}
                            </p>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
