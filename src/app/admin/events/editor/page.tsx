"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import { useToast } from "../../context/ToastContext";
import ImageUpload from "../../components/ImageUpload";
import EditorLayout from "../../components/EditorLayout";
import FormSection from "../../components/FormSection";
import FormField, { inputStyles, inputStylesLg, textareaStyles } from "../../components/FormField";
import ToggleSwitch from "../../components/ToggleSwitch";
import { Image as ImageIcon, Link as LinkIcon, Clock } from "lucide-react";

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
        endDate: "",
        time: "",
        location: "",
        description: "",
        image: "",
        status: "draft",
        ticketLink: "",
        capacity: "",
        featured: false
    });

    // Auto-Save Hook handles drafts
    const { saveStatus, docId, triggerSave } = useAutoSave("events", isNew ? "new" : paramId, formData, isNew);

    useEffect(() => {
        if (!isNew && paramId) {
            const fetchEvent = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "events", paramId));
                    if (docSnap.exists()) {
                        setFormData(prev => ({ ...prev, ...docSnap.data(), featured: docSnap.data().featured || false } as any));
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

            const activeId = docId || paramId;

            if (activeId && activeId !== 'new') {
                await updateDoc(doc(db, "events", activeId), payload);
                showToast("Event published", "success");
            } else {
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

    if (loading) return <div className="p-12 text-center text-gray-400 animate-pulse">Loading event...</div>;

    return (
        <form onSubmit={handleSubmit} className="relative">
            <PageHeader
                title={isNew ? "Create Event" : "Edit Event"}
                description={
                    <span className="flex items-center gap-2">
                        {isNew ? "Schedule and manage event details." : `Editing: ${formData.title}`}
                    </span>
                }
                backHref="/admin/events"
                sticky={true}
            />

            <EditorLayout
                sidebar={
                    <>
                        {/* Cover Image */}
                        <FormSection title="Cover Image" variant="sidebar" icon={<ImageIcon size={14} />}>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                                folder="events"
                            />
                        </FormSection>

                        {/* Links & Tickets */}
                        <FormSection title="Links" variant="sidebar" icon={<LinkIcon size={14} />}>
                            <FormField label="Ticket / RSVP Link" hint="External ticketing URL (e.g. Eventbrite)">
                                <input
                                    type="url"
                                    value={formData.ticketLink}
                                    onChange={(e) => setFormData({ ...formData, ticketLink: e.target.value })}
                                    className={inputStyles}
                                    placeholder="https://..."
                                />
                            </FormField>
                        </FormSection>

                        {/* Settings */}
                        <FormSection title="Settings" variant="sidebar">
                            <FormField label="Capacity" hint="Leave blank for unlimited">
                                <input
                                    type="text"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className={inputStyles}
                                    placeholder="e.g. 150 guests"
                                />
                            </FormField>
                            <ToggleSwitch
                                id="featured"
                                label="Current Exhibition"
                                description="Feature this event as the active exhibition on homepage"
                                checked={formData.featured}
                                onChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </FormSection>
                    </>
                }
            >
                {/* Event Details */}
                <FormSection title="Event Details">
                    <FormField label="Event Title" required>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={inputStylesLg}
                            placeholder="e.g. Opening Night — Spring Collection"
                        />
                    </FormField>

                    <FormField label="Location">
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className={inputStyles}
                            placeholder="e.g. Nava Gallery, Santo Domingo"
                        />
                    </FormField>
                </FormSection>

                {/* Schedule */}
                <FormSection title="Schedule" icon={<Clock size={14} />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormField label="Start Date" hint="When the event begins">
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className={inputStyles}
                            />
                        </FormField>
                        <FormField label="End Date" hint="Leave blank for single-day events">
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className={inputStyles}
                            />
                        </FormField>
                        <FormField label="Time" hint="e.g. 7:00 PM — 10:00 PM">
                            <input
                                type="text"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className={inputStyles}
                                placeholder="7:00 PM"
                            />
                        </FormField>
                    </div>
                </FormSection>

                {/* Description */}
                <FormSection title="About">
                    <FormField
                        label="Description"
                        charCount={{ current: formData.description.length, max: 1500 }}
                    >
                        <textarea
                            rows={8}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={textareaStyles}
                            placeholder="Describe the event, featured artists, and what to expect..."
                        />
                    </FormField>
                </FormSection>
            </EditorLayout>

            <FormActions
                loading={saving}
                onCancel={() => router.push("/admin/events")}
                onSaveDraft={triggerSave}
                saveStatus={saveStatus}
                isPublished={formData.status === "published"}
            />
        </form>
    );
}

export default function EventEditor() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400 animate-pulse">Loading editor...</div>}>
            <EventEditorContent />
        </Suspense>
    );
}
