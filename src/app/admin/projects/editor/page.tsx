"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import ImageUpload from "../../components/ImageUpload";
import EditorLayout from "../../components/EditorLayout";
import FormSection from "../../components/FormSection";
import FormField, { inputStyles, inputStylesLg, textareaStyles, selectStyles } from "../../components/FormField";
import ToggleSwitch from "../../components/ToggleSwitch";
import { X, Image as ImageIcon } from "lucide-react";
import { useToast } from "../../context/ToastContext";

import { useAutoSave } from "@/hooks/useAutoSave";
import RichTextEditor from "../../components/RichTextEditor";

function ProjectEditor() {
    const searchParams = useSearchParams();
    const router = useRouter();
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
        location: "",
        content: "",
        featured: false
    });

    // Auto-Save Hook
    const { saveStatus, docId, triggerSave } = useAutoSave("projects", isNew ? "new" : paramId, formData, isNew);

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
                        status: data.status || "draft",
                        featured: data.featured || false
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

            const activeId = docId || paramId;

            if (activeId && activeId !== 'new') {
                await updateDoc(doc(db, "projects", activeId), payload);
                showToast("Project published", "success");
            } else {
                const ref = await addDoc(collection(db, "projects"), {
                    ...payload,
                    createdAt: now
                });
                showToast("Project created & published", "success");
            }
            router.push("/admin/projects");
        } catch (error) {
            console.error("Save failed:", error);
            showToast("Failed to publish project", "error");
        } finally {
            setLoading(false);
        }
    };

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
                    </span>
                }
                backHref="/admin/projects"
                sticky={true}
            />

            <EditorLayout
                sidebar={
                    <>
                        {/* Cover Image */}
                        <FormSection title="Cover Image" variant="sidebar" icon={<ImageIcon size={14} />}>
                            <ImageUpload
                                value={formData.mainImage}
                                onChange={url => setFormData({ ...formData, mainImage: url })}
                                folder="projects"
                            />
                        </FormSection>

                        {/* Settings */}
                        <FormSection title="Settings" variant="sidebar">
                            <ToggleSwitch
                                id="featured"
                                label="Feature on Homepage"
                                description="Display this project prominently on the front page"
                                checked={formData.featured}
                                onChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </FormSection>
                    </>
                }
            >
                {/* Project Details */}
                <FormSection title="Project Details">
                    <FormField label="Project Title" required>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className={inputStylesLg}
                            placeholder="e.g. Art Basel Installation"
                        />
                    </FormField>

                    <div className="grid grid-cols-3 gap-5">
                        <FormField label="Year">
                            <input
                                type="text"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                className={inputStyles}
                            />
                        </FormField>
                        <FormField label="Category">
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className={selectStyles}
                            >
                                <option>Art Fair</option>
                                <option>Exhibition</option>
                                <option>Installation</option>
                                <option>Digital</option>
                            </select>
                        </FormField>
                        <FormField label="Client / Commission">
                            <input
                                type="text"
                                value={formData.client}
                                onChange={e => setFormData({ ...formData, client: e.target.value })}
                                className={inputStyles}
                                placeholder="e.g. Museo de Arte Moderno"
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Description"
                        hint="A brief summary (Overview)"
                        charCount={{ current: formData.description.length, max: 2000 }}
                    >
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={textareaStyles}
                            placeholder="Describe the project, your approach, and the results..."
                        />
                    </FormField>

                    <FormField
                        label="Content (Details)"
                        hint="Format the detailed project case study here"
                    >
                        <RichTextEditor
                            value={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                        />
                    </FormField>
                </FormSection>

                {/* Gallery */}
                <FormSection title="Gallery Images" description="Additional project photos and documentation">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {formData.gallery.map((url, i) => (
                            <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                                <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i + 1}`} />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(i)}
                                    className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                                >
                                    <X size={11} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                        <p className="text-[10px] text-gray-400 mb-2 text-center uppercase font-bold tracking-wider">Add to Gallery</p>
                        <ImageUpload
                            value=""
                            onChange={addGalleryImage}
                            folder="projects/gallery"
                        />
                    </div>
                </FormSection>
            </EditorLayout>

            <FormActions
                loading={loading}
                onCancel={() => router.push("/admin/projects")}
                onSaveDraft={triggerSave}
                saveStatus={saveStatus}
                isPublished={formData.status === "published"}
            />
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
