"use client";

import { useEffect, useState, Suspense } from "react";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ScrollRevealText from "@/components/anim/ScrollRevealText";

interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    imageUrl?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    artist?: string;
}

function MovementsPageContent() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch List
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "movements"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Event[];
                setEvents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="py-24 text-center text-zinc-500 font-mono animate-pulse">Loading...</div>;
    }

    // LIST VIEW (Archive Logic)
    const today = new Date().toISOString().split('T')[0];

    // Sort logic: "Upcoming" = End Date >= Today (or no dates). "Past" = End Date < Today.
    // If dates missing, default to "Past" or "Upcoming"? Usually "Past" if no data, or keep all in one list?
    // Let's assume standardized dates now.

    // Actually, separating them helps organization.
    const upcoming = events.filter(m => !m.endDate || m.endDate >= today).sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
    // "Upcoming" sorted by date ASC? or DESC? Usually ASC (soonest first).
    // Let's sort Upcoming by Start Date ASC.
    upcoming.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));

    const past = events.filter(m => m.endDate && m.endDate < today).sort((a, b) => (b.startDate || "").localeCompare(a.startDate || "")); // Past sorted DESC (newest first)

    return (
        <div className="flex flex-col gap-12 pb-24 text-[#002FA7]">
            <ScrollRevealText
                text="Events Archive"
                className="text-[10vw] leading-[0.85] tracking-tighter text-[#002FA7] mix-blend-multiply"
                el="h1"
            />

            {/* UPCOMING / CURRENT */}
            {upcoming.length > 0 && (
                <section>
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-6 border-b border-[#002FA7] pb-2">Current & Upcoming</span>
                    <EventList items={upcoming} />
                </section>
            )}

            {/* ARCHIVE */}
            <section className="mt-12">
                <div className="flex items-center gap-4 mb-6 border-b border-[#002FA7] pb-2">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">Archive</span>
                </div>
                {past.length > 0 ? (
                    <EventList items={past} />
                ) : (
                    upcoming.length === 0 && <div className="font-mono text-sm opacity-60">No archival events found.</div>
                )}
            </section>
        </div>
    );
}

function EventList({ items }: { items: Event[] }) {
    return (
        <div className="flex flex-col border-t border-[#002FA7]">
            {items.map((event, index) => (
                <Link
                    href={`/events/${event.id}`}
                    key={event.id}
                    className="group flex flex-col md:flex-row md:items-baseline justify-between py-6 border-b border-[#002FA7] hover:bg-[#002FA7] hover:text-white transition-colors duration-300 cursor-pointer px-0 md:px-4 -mx-0 md:-mx-4"
                >
                    <div className="flex items-baseline gap-4 md:gap-8 w-full md:w-3/4">
                        <span className="font-mono text-xs md:text-sm w-8 opacity-60 group-hover:opacity-100">0{index + 1}</span>
                        <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                            <span className="md:w-32 font-mono text-xs md:text-sm uppercase opacity-60 group-hover:opacity-100 mb-2 md:mb-0">{event.date}</span>
                            <h2 className="text-2xl md:text-3xl group-hover:translate-x-4 transition-transform duration-300">
                                {event.title}
                            </h2>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default function MovementsPage() {
    return (
        <Suspense fallback={<div className="text-white p-8">Loading archive...</div>}>
            <MovementsPageContent />
        </Suspense>
    );
}
