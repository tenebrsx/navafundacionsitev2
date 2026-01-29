"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, StatusBadge } from "../components/AdminShared";
import Link from "next/link";
import { Edit, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../context/ToastContext";

export default function ProjectsList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Order by 'order' ascending. 
            // If strictly relying on Firestore orderBy, it filters out docs missing the field! 
            // We'll try to fetch by order, but if that returns too few, we might fallback.
            // Actually, best practice is to always have 'order'.
            // For now, let's fetch all (since dataset is small) and sort in client to be safe against missing fields.
            const snapshot = await getDocs(collection(db, "projects"));

            let data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];

            // In-memory sort
            // If 'order' is missing, put it at the end (or sort by createdAt)
            data.sort((a, b) => {
                const orderA = typeof a.order === 'number' ? a.order : 9999;
                const orderB = typeof b.order === 'number' ? b.order : 9999;

                if (orderA !== orderB) return orderA - orderB;

                // Secondary sort by date desc
                return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
            });

            // If we found items without 'order', we should probably heal them, but let's just display them for now.
            setProjects(data);

        } catch (error) {
            console.error("Error fetching projects:", error);
            showToast("Failed to load projects", "error");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "projects", deleteId));
            setProjects(prev => prev.filter(p => p.id !== deleteId));
            showToast("Project deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete project", "error");
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (reordering) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === projects.length - 1) return;

        setReordering(true);
        try {
            const newProjects = [...projects];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            // Swap in array
            [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];

            // Optimistic update
            setProjects(newProjects);

            // Update database
            const batch = writeBatch(db);

            // We update specific projects to have their NEW array index as their 'order'.
            // To be robust, let's update all projects' order to their current index to ensure normalization.
            // This heals any missing order fields too.
            newProjects.forEach((proj, idx) => {
                batch.update(doc(db, "projects", proj.id), { order: idx });
            });

            await batch.commit();

        } catch (error) {
            console.error("Move failed:", error);
            showToast("Failed to reorder", "error");
            fetchProjects(); // Revert on error
        } finally {
            setReordering(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Projects"
                description="Manage your portfolio work."
                actionLabel="Add Project"
                actionHref="/admin/projects/editor?id=new"
            />

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading projects...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <div key={project.id} className="bg-white p-8 rounded-xl border border-[#002FA7]/10 hover:border-[#002FA7] transition-all duration-300 group relative flex flex-col justify-between h-auto min-h-[200px] hover:shadow-[0_0_30px_rgba(0,47,167,0.08)]">

                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                                {/* Reorder Controls */}
                                <div className="flex bg-[#F4F4F2] rounded-lg mr-2">
                                    <button
                                        onClick={() => handleMove(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 text-[#002FA7] hover:bg-[#002FA7] hover:text-white transition-colors rounded-l-lg disabled:opacity-30"
                                        title="Move Previous"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <div className="w-px bg-white"></div>
                                    <button
                                        onClick={() => handleMove(index, 'down')}
                                        disabled={index === projects.length - 1}
                                        className="p-2 text-[#002FA7] hover:bg-[#002FA7] hover:text-white transition-colors rounded-r-lg disabled:opacity-30"
                                        title="Move Next"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                                <Link
                                    href={`/admin/projects/editor?id=${project.id}`}
                                    className="p-2 bg-[#F4F4F2] text-[#002FA7] rounded-lg hover:bg-[#002FA7] hover:text-white transition-colors"
                                >
                                    <Edit size={16} />
                                </Link>
                                <button
                                    onClick={() => handleDeleteClick(project.id)}
                                    className="p-2 bg-[#F4F4F2] text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex-1">
                                <div className="mb-6 flex items-start justify-between">
                                    <StatusBadge status={project.status} />
                                </div>
                                <h3 className="text-3xl font-bold text-[#002FA7] leading-none mb-2 tracking-tight line-clamp-2">{project.title}</h3>
                                <div className="flex items-center gap-4 text-[#002FA7]/60 font-mono text-[10px] uppercase tracking-widest mt-4">
                                    <span>{project.client || "No Client"}</span>
                                    <span className="w-1 h-1 bg-[#002FA7]/40 rounded-full"></span>
                                    <span>{project.year || "No Year"}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[#002FA7]/10 flex justify-between items-end">
                                <span className="text-[10px] text-[#002FA7]/40 font-mono uppercase">Order: {index + 1}</span>
                                <div className="w-2 h-2 rounded-full bg-[#002FA7] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full p-20 text-center flex flex-col items-center justify-center border border-dashed border-[#002FA7]/20 rounded-xl bg-[#F4F4F2]">
                            <p className="text-[#002FA7]/40 font-mono text-sm uppercase tracking-widest mb-4">No projects yet</p>
                            <Link href="/admin/projects/editor?id=new" className="px-6 py-3 bg-[#002FA7] text-white rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
                                Add Project
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Project?"
                description="This action cannot be undone. This will permanently remove the project from your database."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </div>
    );
}
