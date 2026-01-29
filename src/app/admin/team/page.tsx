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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {team.map((member) => (
                        <div key={member.id} className="bg-white p-6 rounded-xl border border-[#002FA7]/10 hover:border-[#002FA7] transition-all duration-300 group relative flex items-center gap-6 hover:shadow-[0_0_30px_rgba(0,47,167,0.08)]">

                            {/* Actions Overlay */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Link
                                    href={`/admin/team/editor?id=${member.id}`}
                                    className="p-2 bg-[#F4F4F2] text-[#002FA7] rounded-lg hover:bg-[#002FA7] hover:text-white transition-colors"
                                >
                                    <Edit size={16} />
                                </Link>
                                <button
                                    onClick={() => handleDeleteClick(member.id)}
                                    className="p-2 bg-[#F4F4F2] text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-lg bg-[#F4F4F2] overflow-hidden relative shrink-0 border border-[#002FA7]/10">
                                {member.image ? (
                                    <Image src={member.image} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#002FA7] text-2xl font-black">
                                        {member.name?.[0]}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 py-2">
                                <h3 className="text-xl font-bold text-[#002FA7] truncate pr-8 leading-tight">{member.name}</h3>
                                <p className="text-sm text-[#002FA7]/60 font-mono uppercase tracking-widest mb-3 truncate">{member.role}</p>
                                <StatusBadge status={member.status} />
                            </div>
                        </div>
                    ))}
                    {team.length === 0 && (
                        <div className="col-span-full p-20 text-center flex flex-col items-center justify-center border border-dashed border-[#002FA7]/20 rounded-xl bg-[#F4F4F2]">
                            <p className="text-[#002FA7]/40 font-mono text-sm uppercase tracking-widest mb-4">No team members yet</p>
                            <Link href="/admin/team/editor?id=new" className="px-6 py-3 bg-[#002FA7] text-white rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
                                Add Member
                            </Link>
                        </div>
                    )}
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
