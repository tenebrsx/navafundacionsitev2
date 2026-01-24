"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";
import ImageUpload from "@/components/admin/ImageUpload";

function MovementEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    // "new" or specific ID
    const isNew = !id || id === "new";

    const [formData, setFormData] = useState({
        title: "",
        title_es: "",
        date: "",
        startDate: "", // ISO YYYY-MM-DD
        endDate: "",   // ISO YYYY-MM-DD
        description: "",
        description_es: "",
        imageUrl: "",
    });
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew && id) {
            const fetchMovement = async () => {
                try {
                    const docRef = doc(db, "movements", id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            ...data,
                            startDate: data.startDate || "",
                            endDate: data.endDate || ""
                        } as any);
                    }
                } catch (error) {
                    console.error("Error fetching movement:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMovement();
        }
    }, [id, isNew]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isNew) {
                await addDoc(collection(db, "movements"), formData);
            } else if (id) {
                await setDoc(doc(db, "movements", id), formData);
            }
            router.push("/admin/events");
        } catch (error) {
            console.error("Error saving movement:", error);
            alert("Error saving movement");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 uppercase text-nava-green">
                {isNew ? "New Movement" : "Edit Movement"}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block text-sm uppercase text-zinc-500 mb-2">Title (English)</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-nava-green outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm uppercase text-zinc-500 mb-2">Title (Spanish)</label>
                    <input
                        type="text"
                        value={(formData as any).title_es || ""}
                        onChange={e => setFormData({ ...formData, title_es: e.target.value } as any)}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-nava-green outline-none italic"
                        placeholder="Título en Español"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm uppercase text-nava-green font-bold mb-2">Internal Start Date</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-nava-green outline-none font-mono"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Used for "Upcoming" logic.</p>
                    </div>
                    <div>
                        <label className="block text-sm uppercase text-nava-green font-bold mb-2">Internal End Date</label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-nava-green outline-none font-mono"
                        />
                        <p className="text-xs text-zinc-500 mt-1">When this date passes, next event is shown.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm uppercase text-zinc-500 mb-2">Display Date (Text)</label>
                    <input
                        type="text"
                        required
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-nava-green outline-none font-mono"
                        placeholder="e.g. OCT 17 - NOV 24"
                    />
                </div>

                <div>
                    <label className="block text-sm uppercase text-zinc-500 mb-2">Description (English)</label>
                    <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-nava-green outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm uppercase text-zinc-500 mb-2">Description (Spanish)</label>
                    <textarea
                        rows={5}
                        value={(formData as any).description_es || ""}
                        onChange={e => setFormData({ ...formData, description_es: e.target.value } as any)}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-nava-green outline-none italic"
                        placeholder="Descripción en Español"
                    />
                </div>

                <div>
                    <ImageUpload
                        label="Movement Image"
                        currentImage={formData.imageUrl}
                        onUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    />
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/events")}
                        className="px-6 py-3 border border-zinc-700 text-white font-bold uppercase hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-nava-green text-black font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Movement"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function MovementEditorPage() {
    return (
        <AdminGuard>
            <div className="p-8 text-white pb-24">
                <Suspense fallback={<div>Loading editor...</div>}>
                    <MovementEditorContent />
                </Suspense>
            </div>
        </AdminGuard>
    );
}
