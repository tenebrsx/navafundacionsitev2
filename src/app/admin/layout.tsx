"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileText, FolderOpen, Users, LogOut, Settings, Calendar, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ToastProvider } from "./context/ToastContext";

// Define here for easy addition in the future
const ALLOWED_EMAILS = [
    "nava@nava-fundacion.org",
    "tenebrsx@gmail.com",
    "danicontalba@gmail.com"
];

function AdminGuard({ children }: { children: ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && !user && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F4F2] text-[#002FA7]">
                <div className="flex flex-col items-center gap-4">
                    <span className="font-black text-2xl tracking-tighter uppercase animate-pulse">Nava CMS</span>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#002FA7] animate-[shimmer_1s_infinite] w-full origin-left scale-x-50" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user && pathname !== "/admin/login") {
        return null; // Will redirect
    }

    // Email Guard
    if (user && user.email && !ALLOWED_EMAILS.includes(user.email)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F2] text-[#002FA7] gap-4 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100 text-center">
                    <h1 className="text-xl font-black uppercase text-slate-900 mb-2">Unauthorized Access</h1>
                    <p className="font-medium text-sm text-red-500 mb-4">
                        {user.email} is not whitelisted.
                    </p>
                    <button
                        onClick={() => { logout(); router.push("/admin/login"); }}
                        className="w-full px-6 py-3 bg-slate-900 text-white font-bold uppercase text-xs rounded-lg hover:bg-black transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    // If on login page, just render it
    if (pathname === "/admin/login") {
        return <div className="min-h-screen bg-[#F4F4F2]">{children}</div>;
    }

    // Authenticated Layout
    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-[#F4F4F2] font-sans">
                <Sidebar isOpen={sidebarOpen} />

                <main className="flex-1 relative flex flex-col min-w-0 transition-all duration-300">
                    <div className="sticky top-0 z-50 px-6 pt-6 pointer-events-none flex justify-start">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="pointer-events-auto p-2 bg-[#F4F4F2]/80 hover:bg-white backdrop-blur-md rounded-lg shadow-sm text-[#002FA7] transition-all border border-[#002FA7]/20 hover:border-[#002FA7] hover:scale-105 active:scale-95"
                            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                        </button>
                    </div>

                    <div className="max-w-7xl w-full mx-auto p-8 md:p-14 lg:p-20 pb-32">
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}

function Sidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { label: "Journal", icon: FileText, href: "/admin/posts" },
        { label: "Projects", icon: FolderOpen, href: "/admin/projects" },
        { label: "Team", icon: Users, href: "/admin/team" },
        { label: "Events", icon: Calendar, href: "/admin/events" },
    ];

    return (
        <motion.aside
            initial={{ width: 280 }}
            animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-[#F4F4F2] text-[#002FA7] h-screen sticky top-0 flex flex-col border-r border-[#002FA7]/20 shadow-xl relative z-40 shrink-0 overflow-hidden whitespace-nowrap"
        >
            <div className="w-[280px] h-full flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-[#002FA7]/10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 bg-[#002FA7] rounded-lg flex items-center justify-center font-black text-[#F4F4F2] text-xs shadow-lg shadow-[#002FA7]/20">N</div>
                        <h1 className="text-lg font-bold tracking-tight text-[#002FA7]">NAVA <span className="opacity-50 font-medium">CMS</span></h1>
                    </div>
                    <p className="text-[10px] text-[#002FA7]/60 uppercase tracking-widest font-medium pl-1">v2.0 Data-First</p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="px-3 text-[10px] font-bold uppercase text-[#002FA7]/50 mb-2 tracking-wider">Modules</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                href={item.href}
                                key={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden
                                    ${isActive
                                        ? "bg-[#002FA7] text-[#F4F4F2] shadow-md shadow-[#002FA7]/20"
                                        : "text-[#002FA7]/70 hover:bg-[#002FA7]/5 hover:text-[#002FA7]"}
                                `}
                            >
                                <item.icon size={18} className={`transition-colors ${isActive ? "text-[#F4F4F2]" : "text-[#002FA7]/70 group-hover:text-[#002FA7]"}`} />
                                {item.label}
                                {isActive && <ChevronRight size={14} className="ml-auto text-[#F4F4F2] opacity-50" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* User/LogOut */}
                <div className="p-6 border-t border-[#002FA7]/10 bg-[#002FA7]/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white/10 text-white">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-medium text-[#002FA7] truncate w-32">{user?.email}</p>
                            <p className="text-[10px] text-[#002FA7]/60">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-[#002FA7]/20 text-[#002FA7] text-xs font-bold uppercase tracking-wider hover:bg-[#002FA7] hover:text-[#F4F4F2] transition-all"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AdminGuard>{children}</AdminGuard>
        </AuthProvider>
    );
}

// Global visual tweaks
const styles = `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
