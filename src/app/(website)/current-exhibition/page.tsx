"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSmartEvent } from "@/hooks/useSmartEvent";
import EventDetail from "@/components/EventDetail";

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
    title_es?: string;
    description_es?: string;
    type_es?: string;
}

export default function CurrentExhibitionPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const activeEvent = useSmartEvent(events);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(collection(db, "movements"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Event[];
                setEvents(data);
            } catch (error) {
                console.error("Error fetching movements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-zinc-500 animate-pulse">
                Loading Exhibition...
            </div>
        );
    }

    if (!activeEvent) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-4">
                <h1 className="text-4xl font-bold uppercase text-zinc-600">No Current Exhibition</h1>
                <p className="text-zinc-500">There are no exhibitions scheduled for today.</p>
                <a href="/movements" className="text-nava-green hover:underline uppercase text-sm font-bold mt-4">Browse Archive</a>
            </div>
        );
    }

    const upcomingEvents = activeEvent
        ? events
            .filter(e => e.id !== activeEvent.id)
            .sort((a, b) => {
                const dateA = a.startDate || "9999";
                const dateB = b.startDate || "9999";
                return dateA.localeCompare(dateB);
            })
        : [];

    return (
        <EventDetail
            event={activeEvent}
            upcomingEvents={upcomingEvents}
            backLink="/"
            backLabel="Return Home"
        />
    );
}
