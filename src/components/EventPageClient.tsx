"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventDetail from "@/components/EventDetail";

interface Event {
    id: string;
    title: string;
    title_es?: string;
    date: string;
    description: string;
    description_es?: string;
    image?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    type_es?: string;
    artist?: string;
}

export default function EventPageClient({ id }: { id: string }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCheck = async () => { // Renamed to avoid collision if needed, or just keep simple
            if (!id) return;
            try {
                // Fetch ALL events to populate the sidebar list as well
                const q = query(collection(db, "events"));
                const querySnapshot = await getDocs(q);
                const allEvents = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Event[];

                const foundEvent = allEvents.find((e) => e.id === id);

                if (foundEvent) {
                    setEvent(foundEvent);

                    // Filter out current event and maybe sort by date
                    // For now, just filtering out current. 
                    // Ideally we sort by startDate or order added.
                    const others = allEvents
                        .filter((e) => e.id !== id)
                        .sort((a, b) => {
                            // Simple sort by startDate if available, else date string?
                            // Let's assume startDate ISO or just leave order.
                            const dateA = a.startDate || "9999";
                            const dateB = b.startDate || "9999";
                            return dateA.localeCompare(dateB);
                        });

                    setUpcomingEvents(others);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCheck();
    }, [id]);

    if (loading) {
        return <div className="p-12 text-center text-zinc-500 font-mono animate-pulse">Loading event...</div>;
    }

    if (!event) {
        return (
            <div className="p-12 text-center flex flex-col gap-4 items-center">
                <h1 className="text-2xl font-bold uppercase text-zinc-500">Event Not Found</h1>
                <a href="/events" className="text-nava-green hover:underline uppercase text-xs font-bold">Return to Archive</a>
            </div>
        );
    }

    return (
        <EventDetail
            event={event}
            upcomingEvents={upcomingEvents}
            backLink="/events"
            backLabel="Back to Archive"
        />
    );
}
