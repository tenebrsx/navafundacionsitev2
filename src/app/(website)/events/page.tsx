"use client";

import { useEffect, useState, Suspense } from "react";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
        <div className="flex flex-col gap-12 pb-24">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">
                Events <span className="text-stroke-white text-transparent md:text-white">Archive</span>
            </h1>

            {/* UPCOMING / CURRENT */}
            {upcoming.length > 0 && (
                <section>
                    <h2 className="text-sm font-mono uppercase text-nava-green mb-4 border-b border-zinc-800 pb-2">Current & Upcoming</h2>
                    <EventList items={upcoming} />
                </section>
            )}

            {/* ARCHIVE */}
            <section>
                <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-2">
                    <h2 className="text-sm font-mono uppercase text-zinc-500">Archive</h2>
                    <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                </div>
                {past.length > 0 ? (
                    <EventList items={past} />
                ) : (
                    upcoming.length === 0 && <div className="text-zinc-500">No events found.</div>
                )}
            </section>
        </div>
    );
}

function EventList({ items }: { items: Event[] }) {
    return (
        <div className="flex flex-col">
            {items.map((event, index) => (
                <Link
                    href={`/events/${event.id}`}
                    key={event.id}
                    className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-zinc-800 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer px-2"
                >
                    <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs md:text-sm w-8 text-zinc-500 group-hover:text-black">0{index + 1}</span>
                        <div className="flex flex-col">
                            <h2 className="text-2xl md:text-4xl font-bold uppercase group-hover:italic transition-all">
                                {event.title}
                            </h2>
                            {/* Mobile Info */}
                            <span className="md:hidden font-mono text-xs text-zinc-500 group-hover:text-black mt-1">
                                {event.date}
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-12 font-mono text-sm uppercase">
                        <span className="text-zinc-500 group-hover:text-black">
                            {event.date}
                        </span>
                        <span className="w-32 text-right truncate font-bold">
                            View Details →
                        </span>
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
