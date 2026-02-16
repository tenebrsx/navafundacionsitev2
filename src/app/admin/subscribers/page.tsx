"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Mail, Download, Trash2 } from "lucide-react";
import Link from "next/link";

interface Subscriber {
    id: string;
    email: string;
    timestamp: any;
}

export default function SubscribersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchSubscribers = async () => {
            if (!user) return;
            try {
                const q = query(collection(db, "subscribers"), orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);
                const subs: Subscriber[] = [];
                querySnapshot.forEach((doc) => {
                    subs.push({ id: doc.id, ...doc.data() } as Subscriber);
                });
                setSubscribers(subs);
            } catch (error) {
                console.error("Error fetching subscribers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, [user]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(text);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const copyAllEmails = () => {
        const allEmails = subscribers.map(s => s.email).join(", ");
        navigator.clipboard.writeText(allEmails);
        setCopySuccess("all");
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const handleDelete = async (sub: Subscriber) => {
        if (!confirm(`Delete subscriber ${sub.email}?`)) return;
        try {
            await deleteDoc(doc(db, "subscribers", sub.id));
            setSubscribers(prev => prev.filter(s => s.id !== sub.id));
        } catch (err) {
            console.error("Error deleting subscriber:", err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-screen text-[#002FA7]">
                <div className="animate-pulse">Loading subscribers...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="w-full max-w-5xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-[#002FA7]/60 hover:text-[#002FA7] transition-colors mb-4 text-sm font-mono uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-[#002FA7] tracking-tight flex items-center gap-3">
                        <Mail className="w-8 h-8 md:w-10 md:h-10" />
                        Subscribers <span className="opacity-40 text-2xl align-top">{subscribers.length}</span>
                    </h1>
                </div>

                <button
                    onClick={copyAllEmails}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#002FA7]/5 hover:bg-[#002FA7]/10 text-[#002FA7] rounded-lg transition-colors text-sm font-medium"
                >
                    <Copy size={16} />
                    {copySuccess === "all" ? "Copied All!" : "Copy All Emails"}
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-[#002FA7]/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#002FA7]/5 border-b border-[#002FA7]/10">
                            <tr>
                                <th className="px-6 py-4 text-[#002FA7] font-bold text-sm uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-[#002FA7] font-bold text-sm uppercase tracking-wider">Date Joined</th>
                                <th className="px-6 py-4 text-[#002FA7] font-bold text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#002FA7]/10">
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-[#002FA7]/60">
                                        No subscribers found yet.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-[#002FA7]/5 transition-colors group">
                                        <td className="px-6 py-4 text-[#002FA7] font-medium">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 text-[#002FA7]/60 text-sm">
                                            {sub.timestamp?.seconds
                                                ? new Date(sub.timestamp.seconds * 1000).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : "N/A"
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => copyToClipboard(sub.email)}
                                                    className="p-2 text-[#002FA7]/40 hover:text-[#002FA7] hover:bg-[#002FA7]/10 rounded-full transition-all"
                                                    title="Copy Email"
                                                >
                                                    {copySuccess === sub.email ? (
                                                        <span className="text-xs font-bold px-2">Copied!</span>
                                                    ) : (
                                                        <Copy size={16} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sub)}
                                                    className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                    title="Delete Subscriber"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Actions */}
            <div className="mt-4 md:hidden flex justify-center">
                <button
                    onClick={copyAllEmails}
                    className="flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white rounded-lg shadow-lg text-sm font-medium active:scale-95 transition-transform"
                >
                    <Copy size={16} />
                    {copySuccess === "all" ? "Copied All!" : "Copy All List"}
                </button>
            </div>
        </div>
    );
}
