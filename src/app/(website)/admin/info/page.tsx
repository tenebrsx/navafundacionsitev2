"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminInfoPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        headerText: "Get Involved",
        bodyText: "To participate in Nava 2026, or to propose a movement, please contact us directly.",
        mailingListTitle: "Mailing List",
        mailingListSubtitle: "Subscribe for updates on our movements.",
    });

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        try {
            const docRef = doc(db, "content", "info");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    headerText: data.headerText || "Get Involved",
                    bodyText: data.bodyText || "To participate...",
                    mailingListTitle: data.mailingListTitle || "Mailing List",
                    mailingListSubtitle: data.mailingListSubtitle || "Subscribe for updates...",
                });
            }
        } catch (error) {
            console.error("Error fetching info content:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, "content", "info"), formData);
            alert("Info content updated!");
        } catch (error) {
            console.error("Error saving content:", error);
            alert("Error saving content.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminGuard>
            <div className="p-8 max-w-4xl mx-auto text-white">
                <div className="flex flex-col mb-8">
                    <Link href="/admin" className="text-zinc-500 hover:text-white mb-2 text-sm">← Back to Dashboard</Link>
                    <h1 className="text-4xl font-bold uppercase text-nava-green">Edit Info Page</h1>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 border border-zinc-800 bg-zinc-900/50 p-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold uppercase text-zinc-400">Main Header</label>
                            <input
                                type="text"
                                value={formData.headerText}
                                onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                                className="p-3 bg-black border border-zinc-700 focus:border-nava-green outline-none text-white font-black text-xl"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold uppercase text-zinc-400">Body Text</label>
                            <textarea
                                rows={4}
                                value={formData.bodyText}
                                onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                                className="p-3 bg-black border border-zinc-700 focus:border-nava-green outline-none text-white font-mono text-sm"
                            />
                        </div>

                        <div className="h-px bg-zinc-800 my-4" />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold uppercase text-zinc-400">Mailing List Title</label>
                            <input
                                type="text"
                                value={formData.mailingListTitle}
                                onChange={(e) => setFormData({ ...formData, mailingListTitle: e.target.value })}
                                className="p-3 bg-black border border-zinc-700 focus:border-nava-green outline-none text-white font-bold"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold uppercase text-zinc-400">Mailing List Subtitle</label>
                            <input
                                type="text"
                                value={formData.mailingListSubtitle}
                                onChange={(e) => setFormData({ ...formData, mailingListSubtitle: e.target.value })}
                                className="p-3 bg-black border border-zinc-700 focus:border-nava-green outline-none text-white font-mono text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Link href="/admin" className="px-6 py-3 border border-zinc-700 text-white font-bold uppercase hover:bg-zinc-800 transition-colors">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-nava-green text-black font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminGuard>
    );
}
