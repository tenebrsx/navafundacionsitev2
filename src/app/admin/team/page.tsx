"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, StatusBadge } from "../components/AdminShared";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import Image from "next/image";

export default function TeamList() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Delete state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "team"), orderBy("order", "asc"));
            // Note: If 'order' doesn't exist yet, it might fail or return empty if index missing.
            // Fallback to createdAt or just fetch all
            const snapshot = await getDocs(collection(db, "team"));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTeam(data);
        } catch (error) {
            console.error("Error fetching team:", error);
            showToast("Failed to load team members", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "team", deleteId));
            setTeam(prev => prev.filter(t => t.id !== deleteId));
            showToast("Team member removed", "success");
        } catch (error) {
            showToast("Failed to delete member", "error");
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="px-8 md:px-12 pt-12 pb-24">
            <PageHeader
                title="Team Members"
                description="Manage leadership and team profiles."
                actionLabel="Add Member"
                actionHref="/admin/team/editor?id=new"
            />

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 pl-6 font-bold text-xs uppercase text-gray-400 tracking-wider">Profile</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-400 tracking-wider">Name / Role</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-400 tracking-wider">Status</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-400 tracking-wider text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.map((member) => (
                                <tr key={member.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition group">
                                    <td className="p-4 pl-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                                            {member.image ? (
                                                <Image src={member.image} alt={member.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                                                    {member.name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-900">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={member.status} />
                                    </td>
                                    <td className="p-4 pr-6 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/admin/team/editor?id=${member.id}`}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(member.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {team.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-400 italic">No team members found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Remove Team Member?"
                description="This will permanently delete this member's profile."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </div>
    );
}
