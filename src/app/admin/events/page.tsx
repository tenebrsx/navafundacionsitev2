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
                <div className="grid grid-cols-1 gap-4">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden shrink-0">
                                    {event.image ? (
                                        <Image src={event.image} alt={event.title} fill className="object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                            <CalIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-slate-900 leading-none">{event.title}</h3>
                                        <StatusBadge status={event.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        <span className="flex items-center gap-1"><CalIcon size={12} className="text-blue-500" /> {event.date}</span>
                                        <span className="flex items-center gap-1"><MapPin size={12} className="text-purple-500" /> {event.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/events/editor?id=${event.id}`}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDeleteClick(event.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                            <CalIcon size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-lg font-bold text-gray-400">No Events Found</h3>
                            <p className="text-gray-400 text-sm mb-6">Create your first event to get started.</p>
                            <Link href="/admin/events/editor?id=new" className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase hover:bg-black transition">
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
