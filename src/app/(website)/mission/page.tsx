"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import VisualBlock from "@/components/admin/visual/VisualBlock";
import { useVisualEditor } from "@/components/admin/visual/VisualEditorContext";

interface MissionContent {
    manifestoTitle: string;
    manifestoBody: string;
    principle1: string;
    principle2: string;
    principle3: string;
    principle4: string;
    [key: string]: any;
}

const defaultContent: MissionContent = {
    manifestoTitle: "Radical\nDe-Centralization",
    manifestoBody: "Nava is a platform for Caribbean experimentation. We believe in moving beyond traditional art fair models to create a space that privileges the ephemeral, the educational, and the community-driven.",
    principle1: "Radical Accessibility",
    principle2: "Archival as Art Practice",
    principle3: "Decolonial Aesthesis",
    principle4: "Community First Infrastructure",
};

export default function MissionPage() {
    const { isEditing, setCurrentDoc } = useVisualEditor();
    const [rawDoc, setRawDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Register Document
    useEffect(() => {
        setCurrentDoc({ id: "mission", path: "content" });
    }, [setCurrentDoc]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // We'll store mission content in a doc called 'mission' in 'content' collection
                const docRef = doc(db, "content", "mission");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRawDoc(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching mission content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    // Airlock Logic
    const content: MissionContent = (isEditing && rawDoc?.draft)
        ? { ...defaultContent, ...rawDoc, ...rawDoc.draft }
        : { ...defaultContent, ...(rawDoc || {}) };

    // Helper to render newlines in header
    const renderHeader = (text: string) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                {i < text.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    if (loading) return <div className="text-nava-blue p-8">Loading Mission...</div>;

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-24 pt-12 md:pt-24 pb-24">

            {/* Header / Manifesto */}
            <VisualBlock
                id="mission"
                path="content"
                data={content}
                schema={{
                    manifestoTitle: { type: "text", label: "Manifesto Title" },
                    manifestoBody: { type: "textarea", label: "Manifesto Body" }
                }}
                render={(data: any) => (
                    <section>
                        <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 group-hover:text-nava-blue/70 transition-colors text-nava-blue">
                            {renderHeader(data.manifestoTitle)}
                        </h1>
                        <div className="text-xl md:text-3xl font-medium leading-tight max-w-2xl text-nava-blue/80">
                            {data.manifestoBody}
                        </div>
                    </section>
                )}
            />

            {/* Core Principles */}
            <VisualBlock
                id="mission"
                path="content"
                data={content}
                schema={{
                    principle1: { type: "text", label: "Principle 1" },
                    principle2: { type: "text", label: "Principle 2" },
                    principle3: { type: "text", label: "Principle 3" },
                    principle4: { type: "text", label: "Principle 4" }
                }}
                render={(data: any) => (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-sm md:text-base font-mono border-t border-nava-blue pt-12 text-nava-blue">
                        <div className="flex flex-col gap-6">
                            <h2 className="font-bold uppercase underline decoration-nava-blue decoration-4 underline-offset-4 mb-4">Core Principles</h2>
                            <ul className="list-disc list-inside space-y-4 text-nava-blue/80 text-lg">
                                <li>{data.principle1}</li>
                                <li>{data.principle2}</li>
                                <li>{data.principle3}</li>
                                <li>{data.principle4}</li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6 justify-center">
                            <p className="text-nava-blue/50 text-sm">
                                "We are not just building an exhibition; we are building an infrastructure for the future of Caribbean art."
                            </p>
                        </div>
                    </section>
                )}
            />
        </div>
    );
}
