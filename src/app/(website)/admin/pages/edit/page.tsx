"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";

function PageEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const slugParam = searchParams.get("slug");
    const isNew = !slugParam;

    const [formData, setFormData] = useState({
        slug: "",
        title: "",
        body: "",
        headerImage: "",
    });
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew && slugParam) {
            const fetchPage = async () => {
                try {
                    const docRef = doc(db, "pages", slugParam);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            slug: docSnap.id,
                            title: data.title,
                            body: data.body,
                            headerImage: data.headerImage || ""
                        });
                    }
                } catch (error) {
                    console.error("Error fetching page:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPage();
        }
    }, [slugParam, isNew]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.slug.match(/^[a-z0-9-]+$/)) {
            alert("Slug must only contain lowercase letters, numbers, and hyphens (e.g., 'my-page').");
            return;
        }

        setSaving(true);
        try {
            await setDoc(doc(db, "pages", formData.slug), {
                title: formData.title,
                body: formData.body,
                headerImage: formData.headerImage,
                updatedAt: new Date().toISOString()
            });
            alert("Page saved successfully!");
            router.push("/admin/pages");
        } catch (error) {
            console.error("Error saving page:", error);
            alert("Error saving page.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <div className="flex flex-col mb-8">
                <Link href="/admin/pages" className="text-zinc-500 hover:text-white mb-2 text-sm inline-block">← Back to Pages</Link>
                <h1 className="text-4xl font-bold uppercase text-nava-green">
                    {isNew ? "Create Page" : "Edit Page"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-zinc-900/50 border border-zinc-800 p-8 rounded-lg text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs uppercase text-zinc-500 mb-1">Page Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => {
                                const title = e.target.value;
                                // Auto-generate slug from title if new and slug is empty
                                if (isNew && !formData.slug) {
                                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                                    setFormData(prev => ({ ...prev, title, slug: autoSlug }));
                                } else {
                                    setFormData(prev => ({ ...prev, title }));
                                }
                            }}
                            className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-nava-green outline-none font-bold text-xl"
                            placeholder="e.g. Open Call 2026"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-zinc-500 mb-1">
                            URL Slug (ID)
                            <span className="ml-2 text-zinc-600 normal-case">navafundacion.org/p?slug=...</span>
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!isNew} // Lock slug after creation to prevent ID changes
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            className={`w-full bg-black border border-zinc-700 p-3 text-zinc-300 focus:border-nava-green outline-none font-mono ${!isNew ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="open-call-2026"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Body Content (HTML Supported)</label>
                    <textarea
                        required
                        rows={10}
                        value={formData.body}
                        onChange={e => setFormData({ ...formData, body: e.target.value })}
                        className="w-full bg-black border border-zinc-700 p-4 text-white focus:border-nava-green outline-none font-mono text-sm leading-relaxed"
                        placeholder="Write your page content here..."
                    />
                    <p className="text-[10px] text-zinc-600 mt-2 uppercase">You can use basic HTML tags for formatting if needed.</p>
                </div>

                <div>
                    <ImageUpload
                        label="Header Image (Optional)"
                        currentImage={formData.headerImage}
                        onUpload={(url) => setFormData(prev => ({ ...prev, headerImage: url }))}
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-800">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-nava-green text-black px-8 py-3 font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Page"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function PageEditor() {
    return (
        <AdminGuard>
            <div className="p-8">
                <Suspense fallback={<div className="text-white">Loading Editor...</div>}>
                    <PageEditorContent />
                </Suspense>
            </div>
        </AdminGuard>
    );
}
