"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, StatusBadge } from "../components/AdminShared";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../context/ToastContext";

export default function ProjectsList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Sort by order or date created
            const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            showToast("Failed to load projects", "error");
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
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 font-bold text-xs uppercase text-gray-500">Project</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-500">Status</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-500">Client / Year</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-900">{project.title}</td>
                                    <td className="p-4">
                                        <StatusBadge status={project.status} />
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{project.client} / {project.year}</td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <Link
                                            href={`/admin/projects/editor?id=${project.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(project.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">No projects found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
