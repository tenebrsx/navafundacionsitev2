"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import { useToast } from "../../context/ToastContext";
import ImageUpload from "../../components/ImageUpload";
import { Loader2 } from "lucide-react";

import { useAutoSave } from "@/hooks/useAutoSave";

function TeamEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramId = searchParams.get("id");
    const isNew = !paramId || paramId === "new";

    const { showToast } = useToast();
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        image: "",
        status: "draft",
        linkedin: "",
        order: 0
    });

    // Auto-Save Hook handles drafts
    const { saveStatus, docId } = useAutoSave("team", isNew ? "new" : paramId, formData, isNew);

    useEffect(() => {
        if (!isNew && paramId) {
            const fetchMember = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "team", paramId));
                    if (docSnap.exists()) {
                        setFormData({ ...docSnap.data() } as any);
                    } else {
                        showToast("Member not found", "error");
                        router.push("/admin/team");
                    }
                } catch (error) {
                    showToast("Error loading member", "error");
                } finally {
                    setLoading(false);
                }
            };
            fetchMember();
        }
    }, [paramId, isNew, router, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const now = new Date();
            const payload = {
                ...formData,
                status: "published",
                updatedAt: now,
                order: Number(formData.order)
            };

            // Use the auto-created ID if available, otherwise original param
            const activeId = docId || paramId;

            if (activeId && activeId !== 'new') {
                await updateDoc(doc(db, "team", activeId), payload);
                showToast("Team member published", "success");
            } else {
                await addDoc(collection(db, "team"), { ...payload, createdAt: now });
                showToast("Team member created & published", "success");
            }
            router.push("/admin/team");
        } catch (error) {
            console.error(error);
            showToast("Failed to save", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400 font-mono text-sm animate-pulse">Loading member data...</div>;

    return (
        <form onSubmit={handleSubmit} className="relative">
            <PageHeader
                title={isNew ? "New Team Member" : "Edit Profile"}
                description={
                    <span className="flex items-center gap-2">
                        {isNew ? "Add a new person to your team." : `Editing: ${formData.name}`}
                        {saveStatus === 'saving' && <span className="text-xs text-[#002FA7] animate-pulse">(Saving draft...)</span>}
                        {saveStatus === 'saved' && <span className="text-xs text-green-600">(Draft Saved)</span>}
                    </span>
                }
                backHref="/admin/team"
                sticky={true}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-8 md:px-12 pb-24">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Jane Doe"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Role / Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="e.g. Creative Director"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Bio (Markdown)</label>
                            <textarea
                                rows={6}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Write a short biography..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block">Profile Photo</label>
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            folder="team"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block">LinkedIn URL</label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block">Sort Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-mono text-sm"
                            />
                            <p className="text-[10px] text-gray-400">Lower numbers appear first.</p>
                        </div>
                    </div>
                </div>
            </div>

            <FormActions loading={saving} onCancel={() => router.push("/admin/team")} />
        </form>
    );
}

export default function TeamEditor() {
    return (
        <Suspense fallback={<div className="p-12 text-center animate-pulse">Loading Editor...</div>}>
            <TeamEditorContent />
        </Suspense>
    );
}
