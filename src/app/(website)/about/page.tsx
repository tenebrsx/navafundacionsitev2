"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BrandShowcase from "@/components/BrandShowcase";

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
    const [rawDoc, setRawDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    // Merge logic (simplified, no drafts)
    const content: AboutContent = { ...defaultContent, ...(rawDoc || {}) };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-[#002FA7]">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-24">
            {/* Header Block */}
            <section>
                <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-[#002FA7]">
                    <span className="bg-[#002FA7] px-2 text-white mr-2">Narrativa</span>
                    <br className="md:hidden" />
                    <span className="bg-[#002FA7] text-white px-2">Alternativa</span>
                </h1>
                <div className="text-xl md:text-3xl font-medium leading-tight max-w-2xl text-[#002FA7]">
                    <p>
                        Nava is an experimental foundation focused on decentralizing the contemporary art narrative in the Caribbean.
                    </p>
                </div>
            </section>

            {/* Content Columns */}
            <div className="flex flex-col gap-24 font-mono">

                {/* Director Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                    <div className="relative aspect-[3/4] bg-[#002FA7]/5 border border-[#002FA7]/20">
                        {content.directorImage ? (
                            <img src={content.directorImage} alt={`${content.directorName} - Director`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 mix-blend-multiply" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#002FA7]/40 uppercase text-xs">No Image</div>
                        )}
                    </div>
                    <div className="flex flex-col gap-6 text-[#002FA7]">
                        <h2 className="text-4xl font-black uppercase tracking-tighter">
                            Directora <span className="text-[#002FA7]/60">Nava</span>
                        </h2>
                        <h3 className="text-2xl font-bold uppercase">{content.directorName}</h3>
                        <p className="text-sm md:text-base leading-relaxed text-[#002FA7]/80">
                            {content.directorBio}
                        </p>
                    </div>
                </section>

                {/* History Section */}
                <section className="border-t border-[#002FA7] pt-12 text-[#002FA7]">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">
                        Trayectoria
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-xl uppercase">{content.historyTitle1}</h3>
                            <p className="text-[#002FA7]/60 font-mono text-sm">Phase I</p>
                            <p className="text-sm text-[#002FA7]/80">
                                {content.historyText1}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-xl uppercase">{content.historyTitle2}</h3>
                            <p className="text-[#002FA7]/60 font-mono text-sm">Phase II</p>
                            <p className="text-sm text-[#002FA7]/80">
                                {content.historyText2}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Principles */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-sm md:text-base font-mono border-t border-[#002FA7] pt-12 text-[#002FA7]">
                    <div className="flex flex-col gap-6">
                        <h2 className="font-bold uppercase underline decoration-[#002FA7] decoration-4 underline-offset-4">Core Principles</h2>
                        <ul className="list-disc list-inside space-y-2 text-[#002FA7]/80">
                            <li>{content.principle1}</li>
                            <li>{content.principle2}</li>
                            <li>{content.principle3}</li>
                            <li>{content.principle4}</li>
                        </ul>
                    </div>
                </section>

                {/* News / Blog Section */}
                <section className="border-t border-[#002FA7] pt-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 bg-[#002FA7] text-white inline-block px-2">
                        Latest updates
                    </h2>
                    {/* Render Only */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {((content as any).blogPosts || []).map((data: any, i: number) => (
                            <div key={i} className="bg-transparent p-6 flex flex-col gap-4 border border-[#002FA7]/20 hover:border-[#002FA7] transition-colors h-full">
                                {data.image && (
                                    <div className="aspect-video w-full overflow-hidden mb-2 mix-blend-multiply">
                                        <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <span className="font-mono text-xs text-[#002FA7]/60">{data.date}</span>
                                <h3 className="text-xl font-bold uppercase leading-tight text-[#002FA7]">{data.title}</h3>
                                <p className="text-sm text-[#002FA7]/80 line-clamp-4 leading-relaxed">{data.body}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Brand Identity / Logo Showcase */}
            <BrandShowcase />

            {/* Decorative Footer */}
            <section className="border-t border-[#002FA7] pt-4">
                <p className="font-mono text-xs uppercase text-[#002FA7]/60">
                    Nava Fundacion — Santo Domingo, D.R.
                </p>
            </section>
        </div>
    );
}
