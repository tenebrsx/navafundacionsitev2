"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import { useToast } from "../../context/ToastContext";
import ImageUpload from "../../components/ImageUpload";

function EventEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const isNew = id === "new";

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
        ticketLink: ""
    });

    useEffect(() => {
        if (!isNew && id) {
            const fetchEvent = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "events", id));
                    if (docSnap.exists()) {
                        setFormData({ ...docSnap.data() } as any);
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
    }, [id, isNew, router, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToSave = { ...formData, updatedAt: new Date() };
            if (isNew) {
                await addDoc(collection(db, "events"), { ...dataToSave, createdAt: new Date() });
                showToast("Event created", "success");
            } else if (id) {
                await updateDoc(doc(db, "events", id), dataToSave);
                showToast("Event updated", "success");
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
                description="Manage your event details."
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
