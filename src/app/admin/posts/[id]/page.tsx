"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import ImageUpload from "../../components/ImageUpload";

export default function BlogPostEditor({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params 
    // Note: Next.js 15+ params are promises, sticking to standard async usage pattern if applicable, 
    // but usually in Client Component we can use `use` hook or async logic.
    // For safety with this Next version, let's treat it as a promise if standard patterns apply, 
    // but usually params in page props are objects in previous Next versions. 
    // Assuming Next 15/16 constraints: params is a promise.
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const isNew = id === "new";

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isNew);

    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().split("T")[0],
        category: "News",
        excerpt: "",
        image: "",
        content: "" // We'll assume simple markdown text for now
    });

    useEffect(() => {
        if (!isNew) {
            const fetchPost = async () => {
                const docRef = doc(db, "posts", id);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setFormData(snap.data() as any);
                }
                setFetching(false);
            };
            fetchPost();
        }
    }, [id, isNew]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isNew) {
                await addDoc(collection(db, "posts"), {
                    ...formData,
                    createdAt: new Date().toISOString()
                });
            } else {
                await updateDoc(doc(db, "posts", id), {
                    ...formData,
                    updatedAt: new Date().toISOString()
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
        <div>
            <PageHeader
                title={isNew ? "Create Post" : "Edit Post"}
                description={isNew ? "Write a new journal entry." : `Editing: ${formData.title}`}
            />

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-3xl">
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:border-[#002FA7] outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:border-[#002FA7] outline-none transition"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:border-[#002FA7] outline-none transition"
                            >
                                <option>News</option>
                                <option>Exhibition</option>
                                <option>Press</option>
                                <option>Essay</option>
                            </select>
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Cover Image</label>
                        <ImageUpload
                            value={formData.image}
                            onChange={url => setFormData({ ...formData, image: url })}
                            folder="posts"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Excerpt (Short Summary)</label>
                        <textarea
                            rows={3}
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:border-[#002FA7] outline-none transition"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content (Markdown)</label>
                        <textarea
                            rows={15}
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:border-[#002FA7] outline-none transition font-mono text-sm"
                            placeholder="# Header&#10;&#10;Write your post here..."
                        />
                    </div>
                </div>

                <FormActions
                    loading={loading}
                    onCancel={() => router.push("/admin/posts")}
                />
            </form>
        </div>
    );
}
