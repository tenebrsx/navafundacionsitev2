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
import { FileText, Image as ImageIcon } from "lucide-react";

import { useAutoSave } from "@/hooks/useAutoSave";

function BlogPostEditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paramId = searchParams.get("id");
    const isNew = !paramId || paramId === "new";

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isNew);

    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().split("T")[0],
        category: "News",
        excerpt: "",
        image: "",
        content: "",
        featured: false,
        status: "draft"
    });

    // Auto-Save Hook
    const { saveStatus, docId, triggerSave } = useAutoSave("posts", isNew ? "new" : paramId, formData, isNew);

    useEffect(() => {
        if (!isNew && paramId) {
            const fetchPost = async () => {
                const docRef = doc(db, "posts", paramId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setFormData({ featured: false, status: "draft", ...snap.data() } as any);
                }
                setFetching(false);
            };
            fetchPost();
        }
    }, [paramId, isNew]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const now = new Date().toISOString();
            const payload = { ...formData, status: "published", updatedAt: now };

            const activeId = docId || paramId;

            if (activeId && activeId !== "new") {
                await updateDoc(doc(db, "posts", activeId), payload);
            } else {
                await addDoc(collection(db, "posts"), {
                    ...payload,
                    createdAt: now
                });
            }
            router.push("/admin/posts");
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to save post");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-12 text-center text-gray-400">Loading editor...</div>;

    return (
        <form onSubmit={handleSubmit} className="relative">
            <PageHeader
                title={isNew ? "Create Post" : "Edit Post"}
                description={
                    <span className="flex items-center gap-2">
                        {isNew ? "Write a new journal entry." : `Editing: ${formData.title}`}
                    </span>
                }
                backHref="/admin/posts"
                sticky={true}
            />

            <EditorLayout
                sidebar={
                    <>
                        {/* Cover Image */}
                        <FormSection title="Cover Image" variant="sidebar" icon={<ImageIcon size={14} />}>
                            <ImageUpload
                                value={formData.image}
                                onChange={url => setFormData({ ...formData, image: url })}
                                folder="posts"
                            />
                        </FormSection>

                        {/* Metadata */}
                        <FormSection title="Post Settings" variant="sidebar">
                            <FormField label="Date">
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className={inputStyles}
                                />
                            </FormField>
                            <FormField label="Category">
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className={selectStyles}
                                >
                                    <option>News</option>
                                    <option>Exhibition</option>
                                    <option>Press</option>
                                    <option>Essay</option>
                                </select>
                            </FormField>
                            <ToggleSwitch
                                id="featured"
                                label="Feature on Homepage"
                                description="Pin this post to the Journal section on homepage"
                                checked={formData.featured}
                                onChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </FormSection>
                    </>
                }
            >
                {/* Post Content */}
                <FormSection title="Post Content" icon={<FileText size={14} />}>
                    <FormField label="Title" required>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className={inputStylesLg}
                            placeholder="Enter post title"
                        />
                    </FormField>

                    <FormField
                        label="Excerpt"
                        hint="A brief summary shown in article previews and search results"
                        charCount={{ current: formData.excerpt.length, max: 300 }}
                    >
                        <textarea
                            rows={3}
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            className={textareaStyles}
                            placeholder="Write a compelling one-line summary..."
                        />
                    </FormField>

                    <FormField
                        label="Content"
                        hint="Write in Markdown for rich formatting"
                        charCount={{ current: formData.content.length, max: 10000 }}
                    >
                        <textarea
                            rows={18}
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className={`${textareaStyles} font-mono text-[13px]`}
                            placeholder={"# Heading\n\nWrite your post here..."}
                        />
                    </FormField>
                </FormSection>
            </EditorLayout>

            <FormActions
                loading={loading}
                onCancel={() => router.push("/admin/posts")}
                onSaveDraft={triggerSave}
                saveStatus={saveStatus}
                isPublished={formData.status === "published"}
            />
        </form>
    );
}

export default function BlogPostEditor() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading editor...</div>}>
            <BlogPostEditorContent />
        </Suspense>
    );
}
