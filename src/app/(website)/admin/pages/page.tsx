"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";
import { BLUEPRINTS } from "@/components/admin/blueprints";

export default function AdminPagesList() {
    const router = useRouter();
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Create Modal State
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newSlug, setNewSlug] = useState("");
    const [selectedBlueprint, setSelectedBlueprint] = useState("standard");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "pages"));
            const pagesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPages(pagesList);
        } catch (error) {
            console.error("Error fetching pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this page?")) {
            try {
                await deleteDoc(doc(db, "pages", id));
                setPages(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting page:", error);
                alert("Failed to delete page.");
            }
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setNewTitle(title);
        // Auto-slugify
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        setNewSlug(slug);
    };

    const handleCreatePage = async () => {
        if (!newSlug) return;
        setCreating(true);

        try {
            const docRef = doc(db, "pages", newSlug);
            const exists = (await getDoc(docRef)).exists();

            if (exists) {
                alert("A page with this slug already exists.");
                setCreating(false);
                return;
            }

            const blueprint = BLUEPRINTS.find(b => b.id === selectedBlueprint);
            const pageData = {
                title: newTitle,
                createdAt: new Date().toISOString(),
                ...blueprint?.data
            };

            await setDoc(docRef, pageData);

            // Redirect to the new page
            router.push(`/p?slug=${newSlug}`);

        } catch (error) {
            console.error("Error creating page:", error);
            alert("Failed to create page.");
            setCreating(false);
        }
    };

    return (
        <AdminGuard>
            <div className="p-8 max-w-5xl mx-auto text-white min-h-[60vh]">
                <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
                    <div>
                        <Link href="/admin" className="text-zinc-500 hover:text-white mb-2 text-sm inline-block">← Dashboard</Link>
                        <h1 className="text-4xl font-bold uppercase text-nava-green">Custom Pages</h1>
                    </div>

                    <button
                        onClick={() => setCreateOpen(true)}
                        className="bg-white text-black px-6 py-3 font-bold uppercase hover:bg-zinc-200 transition-colors"
                    >
                        + Create New Page
                    </button>
                </div>

                {loading ? (
                    <div>Loading pages...</div>
                ) : pages.length === 0 ? (
                    <div className="text-zinc-500 font-mono text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                        No custom pages found. Create one to get started.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {pages.map((page) => (
                            <div key={page.id} className="bg-zinc-900/50 border border-zinc-800 p-6 flex justify-between items-center hover:border-zinc-600 transition-colors group">
                                <div>
                                    <h3 className="text-xl font-bold uppercase mb-1">{page.title}</h3>
                                    <div className="flex gap-4 text-xs font-mono text-zinc-500">
                                        <span>Slug: /{page.id}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <Link
                                        href={`/p?slug=${page.id}`}
                                        className="text-nava-green hover:underline uppercase font-bold text-sm"
                                    >
                                        Edit / View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(page.id)}
                                        className="text-red-500 hover:text-red-400 p-2"
                                        title="Delete Page"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setCreateOpen(false)}>
                        <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl p-8 rounded-xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setCreateOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>

                            <h2 className="text-2xl font-bold uppercase text-white mb-8 border-b border-zinc-800 pb-4">Create New Page</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase text-zinc-500 mb-2">Page Title</label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={handleTitleChange}
                                        className="w-full bg-black border border-zinc-700 p-3 text-white outline-none focus:border-nava-green text-lg"
                                        placeholder="e.g. Summer Gala 2026"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-zinc-500 mb-2">URL Slug</label>
                                    <div className="flex items-center bg-black border border-zinc-700 px-3 opacity-70">
                                        <span className="text-zinc-500 mr-1">navafundacion.org/p?slug=</span>
                                        <input
                                            type="text"
                                            value={newSlug}
                                            onChange={e => setNewSlug(e.target.value)}
                                            className="flex-1 bg-transparent p-3 text-nava-green outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-zinc-500 mb-4">Select Blueprint</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {BLUEPRINTS.map(bp => (
                                            <button
                                                key={bp.id}
                                                onClick={() => setSelectedBlueprint(bp.id)}
                                                className={`p-4 border rounded text-left transition-all ${selectedBlueprint === bp.id ? "border-nava-green bg-nava-green/10" : "border-zinc-800 bg-black hover:border-zinc-600"}`}
                                            >
                                                <div className={`font-bold uppercase mb-1 ${selectedBlueprint === bp.id ? "text-nava-green" : "text-white"}`}>{bp.label}</div>
                                                <div className="text-xs text-zinc-500 leading-tight">{bp.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-4">
                                    <button onClick={() => setCreateOpen(false)} className="text-zinc-400 hover:text-white uppercase font-bold text-sm">Cancel</button>
                                    <button
                                        onClick={handleCreatePage}
                                        disabled={!newSlug || creating}
                                        className="bg-nava-green text-black px-8 py-3 font-bold uppercase hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {creating ? "Creating..." : "Create Page"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminGuard>
    );
}
