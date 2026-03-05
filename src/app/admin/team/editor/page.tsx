"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import { useToast } from "../../context/ToastContext";
import ImageUpload from "../../components/ImageUpload";
import EditorLayout from "../../components/EditorLayout";
import FormSection from "../../components/FormSection";
import FormField, { inputStyles, inputStylesLg, textareaStyles } from "../../components/FormField";
import ToggleSwitch from "../../components/ToggleSwitch";
import { User, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

import { useAutoSave } from "@/hooks/useAutoSave";
import RichTextEditor from "../../components/RichTextEditor";

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
        email: "",
        instagram: "",
        linkedin: "",
        order: 0,
        status: "draft",
        featured: false
    });

    // Auto-Save Hook
    const { saveStatus, docId, triggerSave } = useAutoSave("team", isNew ? "new" : paramId, formData, isNew);

    useEffect(() => {
        if (!isNew && paramId) {
            const fetchMember = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "team", paramId));
                    if (docSnap.exists()) {
                        setFormData(prev => ({ ...prev, ...docSnap.data(), featured: docSnap.data().featured || false } as any));
                    } else {
                        showToast("Team member not found", "error");
                        router.push("/admin/team");
                    }
                } catch (error) {
                    showToast("Error loading team member", "error");
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
            const payload = { ...formData, status: "published", updatedAt: now };

            const activeId = docId || paramId;

            if (activeId && activeId !== 'new') {
                await updateDoc(doc(db, "team", activeId), payload);
                showToast("Team member published", "success");
            } else {
                await addDoc(collection(db, "team"), { ...payload, createdAt: now });
                showToast("Team member added", "success");
            }
            router.push("/admin/team");
        } catch (error) {
            console.error(error);
            showToast("Failed to save", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-400 animate-pulse">Loading team member...</div>;

    return (
        <form onSubmit={handleSubmit} className="relative">
            <PageHeader
                title={isNew ? "Add Team Member" : "Edit Team Member"}
                description={
                    <span className="flex items-center gap-2">
                        {isNew ? "Add a new person to the team." : `Editing: ${formData.name}`}
                    </span>
                }
                backHref="/admin/team"
                sticky={true}
            />

            <EditorLayout
                sidebar={
                    <>
                        {/* Photo */}
                        <FormSection title="Photo" variant="sidebar" icon={<ImageIcon size={14} />}>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                                folder="team"
                            />
                        </FormSection>

                        {/* Social Links */}
                        <FormSection title="Social Links" variant="sidebar" icon={<LinkIcon size={14} />}>
                            <FormField label="Email" hint="Contact email (not displayed publicly)">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputStyles}
                                    placeholder="name@nava.org"
                                />
                            </FormField>
                            <FormField label="Instagram">
                                <input
                                    type="text"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                    className={inputStyles}
                                    placeholder="@username"
                                />
                            </FormField>
                            <FormField label="LinkedIn">
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    className={inputStyles}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </FormField>
                        </FormSection>

                        {/* Settings */}
                        <FormSection title="Settings" variant="sidebar">
                            <FormField label="Display Order" hint="Lower numbers appear first on the team page">
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className={inputStyles}
                                />
                            </FormField>
                            <ToggleSwitch
                                id="featured"
                                label="Feature on Homepage"
                                description="Show this team member on the front page"
                                checked={formData.featured}
                                onChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </FormSection>
                    </>
                }
            >
                {/* Member Details */}
                <FormSection title="Member Details" icon={<User size={14} />}>
                    <FormField label="Full Name" required>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputStylesLg}
                            placeholder="e.g. María López"
                        />
                    </FormField>

                    <FormField label="Role / Title">
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className={inputStyles}
                            placeholder="e.g. Curator, Head of Programming"
                        />
                    </FormField>

                    <FormField
                        label="Bio"
                        hint="Format the team member biography here"
                    >
                        <RichTextEditor
                            value={formData.bio}
                            onChange={(html) => setFormData({ ...formData, bio: html })}
                        />
                    </FormField>
                </FormSection>
            </EditorLayout>

            <FormActions
                loading={saving}
                onCancel={() => router.push("/admin/team")}
                onSaveDraft={triggerSave}
                saveStatus={saveStatus}
                isPublished={formData.status === "published"}
            />
        </form>
    );
}

export default function TeamEditor() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400 animate-pulse">Loading editor...</div>}>
            <TeamEditorContent />
        </Suspense>
    );
}
