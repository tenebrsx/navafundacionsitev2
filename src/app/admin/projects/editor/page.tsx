"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import ImageUpload from "../../components/ImageUpload";
import { Plus, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

import { useAutoSave } from "@/hooks/useAutoSave";

function ProjectEditor() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Retrieve ID from URL, but also track dynamic ID creation
    const paramId = searchParams.get("id");
    const isNew = !paramId || paramId === "new";

    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isNew);

    const [formData, setFormData] = useState({
        title: "",
        status: "draft",
        client: "",
        year: new Date().getFullYear().toString(),
        description: "",
        mainImage: "",
        gallery: [] as string[],
        category: "Art Fair",
        location: ""
    });

    // Auto-Save Hook
    const { saveStatus, docId } = useAutoSave("projects", isNew ? "new" : paramId, formData, isNew);

    useEffect(() => {
        if (!isNew && paramId) {
            const fetchProject = async () => {
                const docRef = doc(db, "projects", paramId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        // Ensure we don't accidentally overwrite strict fields if missing
                        status: data.status || "draft"
                    } as any));
                } else {
                    showToast("Project not found", "error");
                }
                setFetching(false);
            };
            fetchProject();
        }
    }, [paramId, isNew, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const now = new Date().toISOString();
            const payload = { ...formData, status: 'published', updatedAt: now };

            // Use the auto-created ID if available, otherwise original param
            const activeId = docId || paramId;

            if (activeId && activeId !== 'new') {
                await updateDoc(doc(db, "projects", activeId), payload);
                showToast("Project uploaded", "success");
            } else {
                // Should behave as fallback create
                const ref = await addDoc(collection(db, "projects"), {
                    ...payload,
                    createdAt: now
                });
                showToast("Project created & uploaded", "success");
            }
            router.push("/admin/projects");
        } catch (error) {
            console.error("Save failed:", error);
            showToast("Failed to upload project", "error");
        } finally {
            setLoading(false);
        }
    };

    // ... existing helpers ...
    const addGalleryImage = (url: string) => {
        if (url) setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    if (fetching) return <div className="p-12 text-center text-gray-400">Loading editor...</div>;

    return (
        <form onSubmit={handleSubmit} className="relative">
            <PageHeader
                title={isNew ? "Create Project" : "Edit Project"}
                description={
                    <span className="flex items-center gap-2">
                        {isNew ? "Add a new portfolio item." : `Editing: ${formData.title}`}
                        {saveStatus === 'saving' && <span className="text-xs text-[#002FA7] animate-pulse">(Saving draft...)</span>}
                        {saveStatus === 'saved' && <span className="text-xs text-green-600">(Draft Saved)</span>}
                    </span>
                }
                backHref="/admin/projects"
                sticky={true}
            />
            {/* ... rest of form ... */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-8 md:px-12 pb-24">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Project Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-bold text-lg"
                                placeholder="e.g. Art Basel Installation"
                            />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="col-span-1 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Year</label>
                                <input
                                    type="text"
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <div className="col-span-1 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                                >
                                    <option>Art Fair</option>
                                    <option>Exhibition</option>
                                    <option>Installation</option>
                                    <option>Digital</option>
                                </select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Client / Commission</label>
                                <input
                                    type="text"
                                    value={formData.client}
                                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</label>
                            <textarea
                                rows={6}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Gallery Images</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {formData.gallery.map((url, i) => (
                                <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                                    <img src={url} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(i)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-400 mb-2 text-center uppercase font-bold tracking-wider">Add to Gallery</p>
                            <ImageUpload
                                value=""
                                onChange={addGalleryImage}
                                folder="projects/gallery"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block">Main Cover Image</label>
                        <ImageUpload
                            value={formData.mainImage}
                            onChange={url => setFormData({ ...formData, mainImage: url })}
                            folder="projects"
                        />
                    </div>
                </div>
            </div>

            <FormActions loading={loading} onCancel={() => router.push("/admin/projects")} />
        </form>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading editor...</div>}>
            <ProjectEditor />
        </Suspense>
    );
}
