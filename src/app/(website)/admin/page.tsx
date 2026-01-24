"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();

    const menuItems = [
        {
            title: "Home Page",
            description: "Edit Featured Exhibition, Research, and Publication blocks.",
            href: "/", // Direct link to public page for Visual Editing
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            title: "About Page",
            description: "Update History and General Info.",
            href: "/about", // Direct link
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Mission Page",
            description: "Edit the Manifesto and Core Principles.",
            href: "/mission",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            )
        },
        {
            title: "Team Page",
            description: "Manage team members.",
            href: "/team",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            title: "Events",
            description: "Create, edit, or delete events and exhibitions.",
            href: "/admin/events",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            title: "Custom Pages",
            description: "Create new pages like 'Open Calls', 'Workshops', etc.",
            href: "/admin/pages",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "Navigation",
            description: "Edit main menu links and columns.",
            href: "/admin/navigation",
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )
        },
        {
            title: "Info & Contact",
            description: "Edit 'Get Involved' text.",
            href: "/info", // Direct link 
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    return (
        <AdminGuard>
            <div className="p-8 max-w-6xl mx-auto text-white min-h-[60vh]">
                <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-nava-green mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-zinc-400 font-mono text-sm max-w-md">
                            Welcome back. Select an area below to update content.
                        </p>
                    </div>
                    <button
                        onClick={() => auth.signOut()}
                        className="text-xs uppercase font-bold text-zinc-500 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group bg-zinc-900/50 border border-zinc-800 p-8 hover:bg-zinc-900 hover:border-nava-green transition-all duration-300 flex items-start gap-6"
                        >
                            <div className="p-4 bg-black border border-zinc-700 text-zinc-400 group-hover:text-nava-green group-hover:border-nava-green transition-colors rounded-sm">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-nava-green transition-colors">{item.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex justify-between items-center text-xs text-zinc-600 font-mono">
                    <span>Nava Foundation CMS v1.0</span>
                    <a href="/" target="_blank" className="hover:text-white underline decoration-zinc-800 underline-offset-4">View Live Site →</a>
                </div>
            </div>
        </AdminGuard>
    );
}
