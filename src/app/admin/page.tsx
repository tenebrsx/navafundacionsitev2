"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FileText, FolderOpen, Users, Calendar, ArrowRight, LayoutDashboard } from "lucide-react";
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
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 text-[#002FA7]/60 mb-2 font-mono text-xs uppercase tracking-widest">
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#002FA7] tracking-tight mb-4">
                    {greeting}, <span className="opacity-60">{user?.email?.split('@')[0]}</span>
                </h1>
                <p className="text-[#002FA7]/60 max-w-xl text-lg">
                    Welcome to the Nava Content Management System. Select a module below to start editing content.
                </p>
            </div>

            {/* Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {modules.map((module) => (
                    <Link href={module.href} key={module.href}>
                        <motion.div
                            variants={item}
                            className="bg-[#F4F4F2] p-8 rounded-xl border border-[#002FA7]/10 hover:border-[#002FA7] shadow-sm hover:shadow-xl hover:shadow-[#002FA7]/5 transition-all duration-300 group h-full flex flex-col relative overflow-hidden"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ArrowRight size={20} className="text-[#002FA7]" />
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-lg bg-[#002FA7]/5 group-hover:bg-[#002FA7] flex items-center justify-center text-[#002FA7] group-hover:text-white transition-colors duration-300">
                                    <module.icon size={24} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#002FA7] mb-2">{module.title}</h3>
                            <p className="text-[#002FA7]/60 text-sm leading-relaxed mb-4 flex-1">
                                {module.description}
                            </p>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
