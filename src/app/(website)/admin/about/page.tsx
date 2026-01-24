"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        directorName: "Olga Alba",
        directorBio: "OLGA ALBA DAUHAJRE ES ARQUITECTA Y ASESORA DE ARTE...",
        directorImage: "",
        historyTitle1: "Feria Internacional",
        historyText1: "Nava began as an international art fair...",
        historyTitle2: "Evolución",
        historyText2: "In 2026, Nava evolves into a Foundation...",
        principle1: "Radical Accessibility",
        principle2: "Archival as Art Practice",
        principle3: "Decolonial Aesthesis",
        principle4: "Community First Infrastructure",
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, "content", "about");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data() as any);
                }
            } catch (error) {
                console.error("Error fetching about content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, "content", "about"), formData);
            alert("About content updated!");
        } catch (error) {
            console.error("Error saving content:", error);
            alert("Error saving content.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <AdminGuard>
            <div className="p-8 max-w-4xl mx-auto text-white pb-24">
                <h1 className="text-4xl font-bold uppercase text-nava-green mb-8">Edit About Page</h1>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Director Section */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold uppercase mb-6 border-b border-zinc-700 pb-2">Director's Profile</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs uppercase text-zinc-500 mb-1">Director Name</label>
                                <input
                                    type="text"
                                    value={formData.directorName}
                                    onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-nava-green outline-none font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-zinc-500 mb-1">Director Bio (Uppercase Recommended)</label>
                                <textarea
                                    rows={4}
                                    value={formData.directorBio}
                                    onChange={(e) => setFormData({ ...formData, directorBio: e.target.value })}
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-nava-green outline-none"
                                />
                            </div>
                            <div>
                                <ImageUpload
                                    label="Director Image"
                                    currentImage={formData.directorImage}
                                    onUpload={(url) => setFormData(prev => ({ ...prev, directorImage: url }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold uppercase mb-6 border-b border-zinc-700 pb-2">History & Evolution</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="block text-xs uppercase text-nava-green">Block 1</label>
                                <input
                                    type="text"
                                    value={formData.historyTitle1}
                                    onChange={(e) => setFormData({ ...formData, historyTitle1: e.target.value })}
                                    className="w-full bg-black border border-zinc-700 p-2 text-white font-bold"
                                />
                                <textarea
                                    rows={4}
                                    value={formData.historyText1}
                                    onChange={(e) => setFormData({ ...formData, historyText1: e.target.value })}
                                    className="w-full bg-black border border-zinc-700 p-2 text-white text-sm"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs uppercase text-nava-green">Block 2</label>
                                <input
                                    type="text"
                                    value={formData.historyTitle2}
                                    onChange={(e) => setFormData({ ...formData, historyTitle2: e.target.value })}
                                    className="w-full bg-black border border-zinc-700 p-2 text-white font-bold"
                                />
                                <textarea
                                    rows={4}
                                    value={formData.historyText2}
                                    onChange={(e) => setFormData({ ...formData, historyText2: e.target.value })}
                                    className="w-full bg-black border border-zinc-700 p-2 text-white text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Core Principles */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold uppercase mb-6 border-b border-zinc-700 pb-2">Core Principles</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <input
                                    key={num}
                                    type="text"
                                    // @ts-ignore
                                    value={formData[`principle${num}`]}
                                    // @ts-ignore
                                    onChange={(e) => setFormData({ ...formData, [`principle${num}`]: e.target.value })}
                                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono"
                                    placeholder={`Principle ${num}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-nava-green text-black px-8 py-3 font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
                        >
                            {saving ? "Saving Changes..." : "Save About Page"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminGuard>
    );
}
