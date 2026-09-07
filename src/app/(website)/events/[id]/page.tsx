import type { Metadata } from "next";
import Link from "next/link";
import EventPageView from "@/components/EventPageView";
import JsonLd from "@/components/seo/JsonLd";
import {
    getAllEvents,
    getEventByParam,
    pathParamsForItem,
} from "@/lib/content";
import { buildMetadata, eventJsonLd } from "@/lib/seo";
import { contentPath } from "@/lib/slug";
import { plainExcerpt } from "@/lib/stripHtml";

export async function generateStaticParams() {
    try {
        const events = await getAllEvents();
        const seen = new Set<string>();
        return events.flatMap((event) => pathParamsForItem(event)).filter(({ id }) => {
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    } catch (error) {
        console.error("Error generating static params for events:", error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const event = await getEventByParam(id);

    if (!event) {
        return buildMetadata({
            title: "Event Not Found",
            path: `/events/${id}`,
            noIndex: true,
        });
    }

    const path = contentPath("events", event);
    return buildMetadata({
        title: event.seoTitle || event.title,
        description:
            plainExcerpt(event.seoDescription, 160) ||
            plainExcerpt(event.description, 160),
        path,
        image: event.image,
    });
}

export default async function EventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEventByParam(id);

    if (!event) {
        return (
            <div className="p-12 text-center flex flex-col gap-4 items-center">
                <h1 className="text-2xl font-bold uppercase text-zinc-500">
                    Event Not Found
                </h1>
                <Link
                    href="/events"
                    className="text-[#002FA7] hover:underline uppercase text-xs font-bold"
                >
                    Return to Archive
                </Link>
            </div>
        );
    }

    const allEvents = await getAllEvents();
    const upcomingEvents = allEvents
        .filter((e) => e.id !== event.id)
        .sort((a, b) =>
            (a.startDate || "9999").localeCompare(b.startDate || "9999")
        );
    const path = contentPath("events", event);

    return (
        <>
            <JsonLd
                data={eventJsonLd({
                    title: event.title,
                    description: event.description,
                    path,
                    image: event.image,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    date: event.date,
                    location: event.location,
                })}
            />
            <EventPageView event={event} upcomingEvents={upcomingEvents} />
        </>
    );
}
