"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Event {
    id: string;
    title: string;
    title_es?: string;
    type?: string;
    type_es?: string;
    date: string;
}

export default function HomePrograms() {
    const { t } = useLanguage();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch latest 3 published events. 
                // Note: orderBy might require an index. If it fails, remove orderBy and sort client side.
                // Using simple fetch for now to match the "Archive" page logic if index is missing.
                const q = query(
                    collection(db, "events"),
                    where("status", "==", "published"),
                    // orderBy("date", "desc"), // Keeping it simple to avoid index error for now
                    limit(3)
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Event[];

                setEvents(data);
            } catch (error) {
                console.error("Error fetching home programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="py-12 md:py-24 flex flex-col px-4 sm:px-12 md:px-24">
                <div className="mb-12 flex justify-between items-end">
                    <h2 className="text-4xl md:text-5xl text-[#002FA7]">{t("Programs", "Programas")}</h2>
                </div>
                <div className="border-t border-[#002FA7]/20 animate-pulse space-y-4 pt-4">
                    <div className="h-12 bg-[#002FA7]/5 w-full rounded"></div>
                    <div className="h-12 bg-[#002FA7]/5 w-full rounded"></div>
                    <div className="h-12 bg-[#002FA7]/5 w-full rounded"></div>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return null; // or empty state
    }

    return (
        <div className="py-12 md:py-24 flex flex-col px-4 sm:px-12 md:px-24">
            <div className="mb-12 flex justify-between items-end">
                <h2 className="text-4xl md:text-5xl text-[#002FA7]">{t("Programs", "Programas")}</h2>
                <Link href="/events" className="hidden md:block uppercase tracking-widest text-xs font-bold hover:underline decoration-1 underline-offset-4 text-[#002FA7]">
                    {t("View Full Calendar", "Ver Calendario Completo")}
                </Link>
            </div>

            <div className="border-t border-[#002FA7]">
                {events.map((item) => (
                    <Link href={`/events/${item.id}`} key={item.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-[#002FA7] hover:bg-[#002FA7] hover:text-white px-0 md:px-4 transition-colors cursor-pointer -mx-0 md:-mx-4">
                        <div className="flex flex-col md:flex-row gap-2 md:gap-8 md:items-baseline">
                            <span className="font-mono text-xs opacity-50 group-hover:opacity-80 w-24 uppercase">
                                {t(item.type || "Event", item.type_es || "Evento")}
                            </span>
                            <h3 className="text-xl md:text-2xl">
                                {t(item.title, item.title_es)}
                            </h3>
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest mt-2 md:mt-0 opacity-60 group-hover:opacity-100">
                            {item.date}
                        </span>
                    </Link>
                ))}
            </div>
            <div className="mt-8 md:hidden">
                <Link href="/events" className="block w-full text-center border border-[#002FA7] py-3 uppercase font-bold text-xs text-[#002FA7]">
                    {t("View Full Calendar", "Ver Calendario Completo")}
                </Link>
            </div>
        </div>
    );
}
