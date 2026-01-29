"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import { useToast } from "../../context/ToastContext";
import ImageUpload from "../../components/ImageUpload";

import { useAutoSave } from "@/hooks/useAutoSave";

function EventEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramId = searchParams.get("id");
    const isNew = !paramId || paramId === "new";

    const { showToast } = useToast();
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        date: "",
        location: "",
        description: "",
        image: "",
        status: "draft",
        ticketLink: "",
        featured: false
    });

    // Auto-Save Hook handles drafts
    const { saveStatus, docId } = useAutoSave("events", isNew ? "new" : paramId, formData, isNew);

    useEffect(() => {
        if (!isNew && paramId) {
            const fetchEvent = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "events", paramId));
                    if (docSnap.exists()) {
                        setFormData({ featured: false, ...docSnap.data() } as any);
                    } else {
                        showToast("Event not found", "error");
                        router.push("/admin/events");
                    }
                } catch (error) {
                    showToast("Error loading event", "error");
                } finally {
                    setLoading(false);
                }
            };
            fetchEvent();
        }
    }, [paramId, isNew, router, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const now = new Date();
            const payload = { ...formData, status: "published", updatedAt: now };

            // Use the auto-created ID if available, otherwise original param
            const activeId = docId || paramId;

            if (activeId && activeId !== 'new') {
                await updateDoc(doc(db, "events", activeId), payload);
                showToast("Event published", "success");
            } else {
                // Should behave as fallback create if auto-save failed/lagged
                await addDoc(collection(db, "events"), { ...payload, createdAt: now });
                showToast("Event created & published", "success");
            }
            router.push("/admin/events");
        } catch (error) {
            console.error(error);
            showToast("Failed to save", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="relative px-8 md:px-12 pt-12 pb-24">
            <PageHeader
                title={isNew ? "Create Event" : "Edit Event"}
                description={
                    <span className="flex items-center gap-2">
                        {isNew ? "Manage your event details." : `Editing: ${formData.title}`}
                        {saveStatus === 'saving' && <span className="text-xs text-[#002FA7] animate-pulse">(Saving draft...)</span>}
                        {saveStatus === 'saved' && <span className="text-xs text-green-600">(Draft Saved)</span>}
                    </span>
                }
                backHref="/admin/events"
            />
            <div className="space-y-6 max-w-2xl">
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event Title"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold"
                />
                <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />

                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg transition-colors hover:border-[#002FA7]/30">
                    <input
                        type="checkbox"
                        id="featured"
                        checked={!!(formData as any).featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked } as any)}
                        className="w-5 h-5 text-[#002FA7] rounded focus:ring-[#002FA7] cursor-pointer accent-[#002FA7]"
                    />
                    <label htmlFor="featured" className="text-sm font-bold text-gray-700 select-none cursor-pointer flex-1">
                        Feature on Homepage (Current Exhibition)
                    </label>
                </div>
                <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} folder="events" />
                <FormActions loading={saving} onCancel={() => router.push("/admin/events")} />
            </div>
        </form>
    );
}

export default function EventEditor() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventEditorContent />
        </Suspense>
    );
}
