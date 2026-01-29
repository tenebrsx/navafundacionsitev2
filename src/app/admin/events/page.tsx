"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, StatusBadge } from "../components/AdminShared";
import Link from "next/link";
import { Edit, Trash2, Calendar as CalIcon, MapPin } from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import Image from "next/image";

export default function EventsList() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Delete state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Sorting by dateDesc if possible, otherwise simple fetch
            const q = query(collection(db, "events"), orderBy("date", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
            // Fallback for missing index
            try {
                const snapshot = await getDocs(collection(db, "events"));
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(data);
            } catch (e) {
                showToast("Failed to load events", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "events", deleteId));
            setEvents(prev => prev.filter(e => e.id !== deleteId));
            showToast("Event deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete event", "error");
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="px-8 md:px-12 pt-12 pb-24">
            <PageHeader
                title="Events"
                description="Manage upcoming exhibitions and fairs."
                actionLabel="Create Event"
                actionHref="/admin/events/editor?id=new"
            />

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl border border-[#002FA7]/10 hover:border-[#002FA7] transition-all duration-300 group relative flex flex-col overflow-hidden hover:shadow-[0_0_30px_rgba(0,47,167,0.08)]">

                            {/* Image Header */}
                            <div className="h-48 w-full bg-[#002FA7]/5 relative overflow-hidden">
                                {event.image ? (
                                    <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#002FA7]/20">
                                        <CalIcon size={32} strokeWidth={1} />
                                        <span className="text-[10px] font-mono mt-2 uppercase tracking-widest">No Image</span>
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>

                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y--2 group-hover:translate-y-0 z-20">
                                    <Link
                                        href={`/admin/events/editor?id=${event.id}`}
                                        className="p-2 bg-white/90 backdrop-blur text-[#002FA7] rounded-lg hover:bg-[#002FA7] hover:text-white transition-colors shadow-lg"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(event.id)}
                                        className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <StatusBadge status={event.status} />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-[#002FA7] leading-tight mb-4 line-clamp-2">{event.title}</h3>

                                <div className="mt-auto space-y-2">
                                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#002FA7]/70">
                                        <CalIcon size={12} />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#002FA7]/70">
                                        <MapPin size={12} />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="col-span-full p-20 text-center flex flex-col items-center justify-center border border-dashed border-[#002FA7]/20 rounded-xl bg-[#F4F4F2]">
                            <CalIcon size={48} className="mx-auto text-[#002FA7]/20 mb-4" />
                            <p className="text-[#002FA7]/40 font-mono text-sm uppercase tracking-widest mb-4">No events scheduled</p>
                            <Link href="/admin/events/editor?id=new" className="px-6 py-3 bg-[#002FA7] text-white rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
                                Create Event
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Event?"
                description="This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </div>
    );
}
