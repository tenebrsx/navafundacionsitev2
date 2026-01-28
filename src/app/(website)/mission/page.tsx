"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
    const [rawDoc, setRawDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    // Merge logic
    const content: MissionContent = { ...defaultContent, ...(rawDoc || {}) };

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

    if (loading) return <div className="text-[#002FA7] p-8">Loading Mission...</div>;

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-24 pt-12 md:pt-24 pb-24">

            {/* Header / Manifesto */}
            <section>
                <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-[#002FA7]">
                    {renderHeader(content.manifestoTitle)}
                </h1>
                <div className="text-xl md:text-3xl font-medium leading-tight max-w-2xl text-[#002FA7]/80">
                    {content.manifestoBody}
                </div>
            </section>

            {/* Core Principles */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-sm md:text-base font-mono border-t border-[#002FA7] pt-12 text-[#002FA7]">
                <div className="flex flex-col gap-6">
                    <h2 className="font-bold uppercase underline decoration-[#002FA7] decoration-4 underline-offset-4 mb-4">Core Principles</h2>
                    <ul className="list-disc list-inside space-y-4 text-[#002FA7]/80 text-lg">
                        <li>{content.principle1}</li>
                        <li>{content.principle2}</li>
                        <li>{content.principle3}</li>
                        <li>{content.principle4}</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-6 justify-center">
                    <p className="text-[#002FA7]/50 text-sm">
                        "We are not just building an exhibition; we are building an infrastructure for the future of Caribbean art."
                    </p>
                </div>
            </section>
        </div>
    );
}
