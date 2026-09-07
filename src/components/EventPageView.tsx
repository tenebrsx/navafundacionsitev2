"use client";

import EventDetail from "@/components/EventDetail";

type Event = {
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
    location?: string;
    slug?: string;
};

export default function EventPageView({
    event,
    upcomingEvents,
}: {
    event: Event;
    upcomingEvents: Event[];
}) {
    return (
        <EventDetail
            event={event}
            upcomingEvents={upcomingEvents}
            backLink="/events"
            backLabel="Back to Archive"
        />
    );
}
