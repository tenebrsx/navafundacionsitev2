"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FileText, FolderOpen, Users, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StatCard, QuickAction, ModuleCard } from "./components/DashboardWidgets";

export default function AdminDashboard() {
    const { user } = useAuth();
    const userName = user?.email?.split("@")[0] || "Admin";
    const [stats, setStats] = useState({ posts: 0, projects: 0, team: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const postsSnap = await getDocs(query(collection(db, "posts")));
                const projectsSnap = await getDocs(query(collection(db, "projects")));
                // const teamSnap = await getDocs(query(collection(db, "team"))); 

                setStats({
                    posts: postsSnap.size,
                    projects: projectsSnap.size,
                    team: 0 // teamSnap.size
                });
            } catch (e) { console.error(e); }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 px-8 md:px-12 pt-12 pb-24">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2 font-medium">Welcome back, <span className="text-slate-900">{userName}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Posts" value={stats.posts} icon={FileText} color="bg-blue-600 text-blue-600" />
                <StatCard label="Active Projects" value={stats.projects} icon={FolderOpen} color="bg-purple-600 text-purple-600" />
                <StatCard label="Team Members" value={stats.team} icon={Users} color="bg-emerald-600 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <QuickAction href="/admin/posts/editor?id=new" title="Write New Post" icon={FileText} color="text-blue-600 bg-blue-50" />
                            <QuickAction href="/admin/projects/editor?id=new" title="Add New Project" icon={FolderOpen} color="text-purple-600 bg-purple-50" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
