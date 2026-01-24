"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";
import ImageUpload from "@/components/admin/ImageUpload";

interface FeatureBlock {
    category: string;
    title: string;
    subtitle: string;
    imageUrl: string;
}

interface HomeContent {
    hero: FeatureBlock;
    subFeature1: FeatureBlock;
    subFeature2: FeatureBlock;
}

const defaultContent: HomeContent = {
    hero: { category: "Current Exhibition", title: "Foco Latam", subtitle: "Curated by...", imageUrl: "" },
    subFeature1: { category: "Publication", title: "No-Objetos", subtitle: "Julianny Ariza", imageUrl: "" },
    subFeature2: { category: "Research", title: "Archives", subtitle: "Preservation", imageUrl: "" },
};

export default function AdminHomeConfig() {
    const [content, setContent] = useState<HomeContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, "content", "home");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContent(docSnap.data() as HomeContent);
                }
            } catch (error) {
                console.error("Error fetching home content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleChange = (section: keyof HomeContent, field: keyof FeatureBlock, value: string) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "content", "home"), content);
            setMessage("Content saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error saving content:", error);
            setMessage("Error saving content.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading editor...</div>;

    return (
        <AdminGuard>
            <div className="p-8 max-w-4xl mx-auto text-white pb-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold uppercase text-nava-green">Edit Home Page</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-nava-green text-black px-6 py-2 font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {message && <div className="mb-4 text-nava-green font-mono">{message}</div>}

                <div className="space-y-12">
                    {/* Hero Section */}
                    <SectionEditor
                        label="Main Feature (Left Column)"
                        data={content.hero}
                        onChange={(f, v) => handleChange("hero", f, v)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Sub Feature 1 */}
                        <SectionEditor
                            label="Sub Feature 1 (Left Grid)"
                            data={content.subFeature1}
                            onChange={(f, v) => handleChange("subFeature1", f, v)}
                        />
                        {/* Sub Feature 2 */}
                        <SectionEditor
                            label="Sub Feature 2 (Left Grid)"
                            data={content.subFeature2}
                            onChange={(f, v) => handleChange("subFeature2", f, v)}
                        />
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}

function SectionEditor({ label, data, onChange }: { label: string, data: FeatureBlock, onChange: (field: keyof FeatureBlock, value: string) => void }) {
    if (!data) return null; // Safe guard
    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2">{label}</h3>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Category Label</label>
                    <input
                        type="text"
                        value={data.category}
                        onChange={e => onChange("category", e.target.value)}
                        className="w-full bg-black border border-zinc-700 p-2 text-white focus:border-nava-green outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={e => onChange("title", e.target.value)}
                        className="w-full bg-black border border-zinc-700 p-2 text-white focus:border-nava-green outline-none font-bold"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Subtitle / Description</label>
                    <textarea
                        value={data.subtitle}
                        onChange={e => onChange("subtitle", e.target.value)}
                        className="w-full bg-black border border-zinc-700 p-2 text-white focus:border-nava-green outline-none"
                        rows={2}
                    />
                </div>
                <div>
                    <ImageUpload
                        label="Image"
                        currentImage={data.imageUrl}
                        onUpload={(url) => onChange("imageUrl", url)}
                    />
                </div>
            </div>
        </div>
    );
}
