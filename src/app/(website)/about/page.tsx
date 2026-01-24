"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import VisualBlock from "@/components/admin/visual/VisualBlock";
import VisualBlockList from "@/components/admin/visual/VisualBlockList";
import { useVisualEditor } from "@/components/admin/visual/VisualEditorContext";

interface AboutContent {
    directorName: string;
    directorBio: string;
    directorImage: string;
    historyTitle1: string;
    historyText1: string;
    historyTitle2: string;
    historyText2: string;
    principle1: string;
    principle2: string;
    principle3: string;
    principle4: string;
    [key: string]: any;
}

const defaultContent: AboutContent = {
    directorName: "Olga Alba",
    directorBio: "OLGA ALBA DAUHAJRE ES ARQUITECTA Y ASESORA DE ARTE DOMINICANA. SU PRÁCTICA SE MUEVE ENTRE LA GESTIÓN CULTURAL, EL ACOMPAÑAMIENTO CURATORIAL Y EL ARTE CONTEMPORÁNEO, ENFOCADA EN LA CREACIÓN DE PLATAFORMAS Y PROYECTOS QUE CONECTAN ARTISTAS, CONTEXTOS Y NARRATIVAS DEL CARIBE CON CIRCUITOS INTERNACIONALES.",
    directorImage: "/olga-alba.png",
    historyTitle1: "Feria Internacional",
    historyText1: "Nava began as an international art fair, successfully running editions in 2023 and 2024 in Santo Domingo. These events brought together galleries, artists, and collectors to celebrate Caribbean creativity.",
    historyTitle2: "Evolución",
    historyText2: "In 2026, Nava evolves into a Foundation. Moving beyond the traditional fair model, we now focus on 'No-Objetos' (Non-Objects), ephemeral interventions, and educational programs that prioritize cultural impact over commercial transaction.",
    principle1: "Radical Accessibility",
    principle2: "Archival as Art Practice",
    principle3: "Decolonial Aesthesis",
    principle4: "Community First Infrastructure",
};

export default function AboutPage() {
    const { isEditing, setCurrentDoc } = useVisualEditor();
    const [rawDoc, setRawDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Register Document for Airlock
    useEffect(() => {
        setCurrentDoc({ id: "about", path: "content" });
    }, [setCurrentDoc]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, "content", "about");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRawDoc(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching about content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    // Airlock Logic: Merge Draft if Editing
    const content: AboutContent = (isEditing && rawDoc?.draft)
        ? { ...defaultContent, ...rawDoc, ...rawDoc.draft }
        : { ...defaultContent, ...(rawDoc || {}) };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-24">
            {/* Header Block */}
            <section>
                <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                    <span className="bg-nava-green px-2 text-black mr-2">Narrativa</span>
                    <br className="md:hidden" />
                    <span className="bg-white text-black px-2">Alternativa</span>
                </h1>
                <div className="text-xl md:text-3xl font-medium leading-tight max-w-2xl">
                    <p>
                        Nava is an experimental foundation focused on decentralizing the contemporary art narrative in the Caribbean.
                    </p>
                </div>
            </section>

            {/* Content Columns */}
            <div className="flex flex-col gap-24 font-mono">

                {/* Director Section */}
                <VisualBlock
                    id="about"
                    path="content"
                    data={content}
                    schema={{
                        directorName: { type: "text", label: "Director Name" },
                        directorBio: { type: "textarea", label: "Director Bio" },
                        directorImage: { type: "image", label: "Director Image" }
                    }}
                    render={(data: any) => (
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                            <div className="relative aspect-[3/4] bg-zinc-800 border border-zinc-700">
                                {data.directorImage ? (
                                    <img src={data.directorImage} alt={`${data.directorName} - Director`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600 uppercase text-xs">No Image</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-6">
                                <h2 className="text-4xl font-black uppercase tracking-tighter">
                                    Directora <span className="text-nava-green">Nava</span>
                                </h2>
                                <h3 className="text-2xl font-bold uppercase">{data.directorName}</h3>
                                <p className="text-sm md:text-base leading-relaxed text-zinc-400">
                                    {data.directorBio}
                                </p>
                            </div>
                        </section>
                    )}
                />

                {/* History Section */}
                <VisualBlock
                    id="about"
                    path="content"
                    data={content}
                    schema={{
                        historyTitle1: { type: "text", label: "History Title 1" },
                        historyText1: { type: "textarea", label: "History Text 1" },
                        historyTitle2: { type: "text", label: "History Title 2" },
                        historyText2: { type: "textarea", label: "History Text 2" }
                    }}
                    render={(data: any) => (
                        <section className="border-t border-white pt-12">
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">
                                Trayectoria
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-4">
                                    <h3 className="font-bold text-xl uppercase">{data.historyTitle1}</h3>
                                    <p className="text-zinc-500 font-mono text-sm">Phase I</p>
                                    <p className="text-sm text-zinc-300">
                                        {data.historyText1}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h3 className="font-bold text-xl uppercase">{data.historyTitle2}</h3>
                                    <p className="text-zinc-500 font-mono text-sm">Phase II</p>
                                    <p className="text-sm text-zinc-300">
                                        {data.historyText2}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                />

                {/* Core Principles */}
                <VisualBlock
                    id="about"
                    path="content"
                    data={content}
                    schema={{
                        principle1: { type: "text", label: "Principle 1" },
                        principle2: { type: "text", label: "Principle 2" },
                        principle3: { type: "text", label: "Principle 3" },
                        principle4: { type: "text", label: "Principle 4" }
                    }}
                    render={(data: any) => (
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-sm md:text-base font-mono border-t border-white pt-12">
                            <div className="flex flex-col gap-6">
                                <h2 className="font-bold uppercase underline decoration-nava-green decoration-4 underline-offset-4">Core Principles</h2>
                                <ul className="list-disc list-inside space-y-2 text-zinc-300">
                                    <li>{data.principle1}</li>
                                    <li>{data.principle2}</li>
                                    <li>{data.principle3}</li>
                                    <li>{data.principle4}</li>
                                </ul>
                            </div>
                        </section>
                    )}
                />

                {/* News / Blog Section */}
                <section className="border-t border-white pt-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 bg-nava-green text-black inline-block px-2">
                        Latest updates
                    </h2>
                    <VisualBlockList
                        id="about"
                        path="content"
                        fieldPath="blogPosts"
                        items={(content as any).blogPosts || []}
                        itemSchema={{
                            title: { type: "text", label: "Post Title" },
                            date: { type: "text", label: "Date" },
                            body: { type: "textarea", label: "Content" },
                            image: { type: "image", label: "Image (Optional)" }
                        }}
                        defaultItemData={{
                            title: "New Post",
                            date: "Jan 01",
                            body: "Write something..."
                        }}
                        direction="grid"
                        renderItem={(data, i) => (
                            <div className="bg-zinc-900 p-6 flex flex-col gap-4 border border-zinc-800 hover:border-nava-green transition-colors h-full">
                                {data.image && (
                                    <div className="aspect-video w-full overflow-hidden mb-2">
                                        <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <span className="font-mono text-xs text-nava-green">{data.date}</span>
                                <h3 className="text-xl font-bold uppercase leading-tight">{data.title}</h3>
                                <p className="text-sm text-zinc-400 line-clamp-4 leading-relaxed">{data.body}</p>
                            </div>
                        )}
                    />
                </section>
            </div>

            {/* Decorative Footer */}
            <section className="border-t border-white pt-4">
                <p className="font-mono text-xs uppercase text-zinc-500">
                    Nava Fundacion — Santo Domingo, D.R.
                </p>
            </section>
        </div>
    );
}
