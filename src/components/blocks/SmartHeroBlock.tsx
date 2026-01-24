"use client";

import { useSmartEvent } from "@/hooks/useSmartEvent"; // Assuming hooks moved or we copy logic
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import InlineText from "../admin/visual/InlineText";
import { useVisualEditor } from "../admin/visual/VisualEditorContext";

export default function SmartHeroBlock({ data }: { data: any }) {
    const { isEditing } = useVisualEditor();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const q = query(collection(db, "movements"));
            const snap = await getDocs(q);
            const evs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setEvents(evs);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    // Simple Smart Logic: find first future event or current
    const now = new Date();
    const currentOrFuture = events
        .filter((e: any) => new Date(e.endDate || e.date) >= now)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    // Smart Override Logic:
    // If data.title is set (via inline edit), use it. Else use smart title.
    const smartProps = currentOrFuture ? {
        title: currentOrFuture.title,
        subtitle: currentOrFuture.description,
        image: currentOrFuture.imageUrl,
        category: "Current Exhibition",
        link: `/events/${currentOrFuture.id}`
    } : {
        title: "Welcome",
        subtitle: "No upcoming events.",
        image: null,
        category: "Featured",
        link: "#"
    };

    const display = {
        title: data.title || smartProps.title,
        subtitle: data.subtitle || smartProps.subtitle,
        image: data.image || smartProps.image, // Allow image override too (via Vault)
        category: data.category || smartProps.category,
        link: data.link || smartProps.link
    };

    // Disable link in edit mode to allow text selection
    const Wrapper = isEditing ? "div" : Link;

    return (
        <Wrapper href={display.link} className="block relative w-full aspect-[21/9] bg-zinc-900 border border-zinc-800 overflow-hidden group">
            {display.image ? (
                <img
                    src={display.image}
                    alt={display.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold uppercase tracking-widest">
                    Hero Image
                </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                <span className="bg-nava-green text-black px-2 py-1 text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                    {display.category}
                </span>

                {/* Inline Editable Title */}
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2 leading-none drop-shadow-lg">
                    <InlineText
                        field="title"
                        placeholder={smartProps.title}
                        className="min-w-[5ch] inline-block" // min-width to ensure click handle if empty
                    />
                </h2>

                <p className="text-lg md:text-2xl font-mono text-zinc-300 max-w-2xl drop-shadow-md">
                    <InlineText field="subtitle" placeholder={smartProps.subtitle} />
                </p>
            </div>

            {!isEditing && (
                <div className="absolute bottom-4 right-4 text-xs font-mono text-nava-green opacity-0 group-hover:opacity-100 transition-opacity">
                    SMART DISPLAY ACTIVE
                </div>
            )}
        </Wrapper>
    );
}
