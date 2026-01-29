import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

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

interface EventDetailProps {
    event: Event;
    upcomingEvents?: Event[]; // Added prop
    backLink?: string;
    backLabel?: string;
}

export default function EventDetail({ event, upcomingEvents = [], backLink = "/events", backLabel = "Back to Archive" }: EventDetailProps) {
    const { t } = useLanguage();

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-12 pt-8 md:pt-16 pb-24 px-4 md:px-0">

            {/* Header / Nav Back */}
            <div className="flex justify-between items-end border-b border-white pb-4">
                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#002FA7]">
                    {t(event.title, event.title_es)}
                </h1>
                <Link href={backLink} className="hidden md:block font-mono text-xs uppercase hover:underline text-[#002FA7]">
                    {t(backLabel, "Volver al Archivo")}
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">

                {/* Left Column: Image & Bio */}
                <div className="md:col-span-8 flex flex-col gap-8">
                    {/* Hero Image */}
                    <div className="w-full aspect-video bg-[#F4F4F2] border border-[#002FA7]/20">
                        {event.image ? (
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#002FA7]/50 font-mono text-xs uppercase">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Description Body */}
                    <div className="font-mono text-[#002FA7] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {t(event.description, event.description_es)}
                    </div>
                </div>

                {/* Right Column: Metadata Sidebar */}
                <div className="md:col-span-4 flex flex-col gap-12 h-full">

                    <div>
                        {/* Date Block */}
                        <div className="border-t border-[#002FA7] pt-2">
                            <label className="block text-xs uppercase text-[#002FA7]/60 mb-1">Date</label>
                            <p className="text-xl font-bold uppercase text-[#002FA7]">{event.date}</p>
                            {event.startDate && (
                                <p className="text-xs font-mono text-[#002FA7]/60 mt-1">
                                    {event.startDate} — {event.endDate || "Ongoing"}
                                </p>
                            )}
                        </div>

                        {/* Artist / Type Block */}
                        {(event.artist || event.type || event.type_es) && (
                            <div className="border-t border-[#002FA7] pt-2 mt-8">
                                <label className="block text-xs uppercase text-[#002FA7]/60 mb-1">Details</label>
                                {event.artist && <p className="text-lg font-bold uppercase text-[#002FA7]">{event.artist}</p>}
                                {(event.type || event.type_es) && <p className="text-sm font-mono text-[#002FA7] uppercase mt-1">
                                    {t(event.type || "", event.type_es || "")}
                                </p>}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events List */}
                    {upcomingEvents && upcomingEvents.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center border-b border-[#002FA7]/20 pb-2 mb-6">
                                <h2 className="font-mono text-sm uppercase text-[#002FA7]/60">
                                    {t("Upcoming", "Próximos")}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-6">
                                {upcomingEvents.map((item) => (
                                    <Link key={item.id} href={`/events/${item.id}`} className="group cursor-pointer block">
                                        <span className="block font-mono text-xs text-[#002FA7] mb-1">{item.date}</span>
                                        <h3 className="text-xl font-bold uppercase leading-tight group-hover:underline decoration-1 underline-offset-4 text-[#002FA7]">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-[#002FA7]/60 mt-1 line-clamp-1">{item.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mobile Back Link */}
                    <div className="mt-auto pt-12 md:hidden">
                        <Link href={backLink} className="block w-full text-center border border-[#002FA7] py-3 uppercase font-bold text-sm text-[#002FA7] hover:bg-[#002FA7] hover:text-white transition-colors">
                            {backLabel}
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
}
