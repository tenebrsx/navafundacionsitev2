"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, StatusBadge } from "../components/AdminShared";
import Link from "next/link";
import { Edit, Trash2, ArrowLeft, ArrowRight, Palette } from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import Image from "next/image";

export default function CatalogList() {
    const [artworks, setArtworks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);

    const fetchArtworks = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "catalog"));
            let data = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data()
            })) as any[];

            data.sort((a, b) => {
                const orderA = typeof a.order === "number" ? a.order : 9999;
                const orderB = typeof b.order === "number" ? b.order : 9999;
                if (orderA !== orderB) return orderA - orderB;
                return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
            });

            setArtworks(data);
        } catch (error) {
            console.error("Error fetching catalog:", error);
            showToast("Failed to load catalog", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    const handleDeleteClick = (id: string) => setDeleteId(id);

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "catalog", deleteId));
            setArtworks(prev => prev.filter(a => a.id !== deleteId));
            showToast("Artwork deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete artwork", "error");
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const handleMove = async (index: number, direction: "up" | "down") => {
        if (reordering) return;
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === artworks.length - 1) return;

        setReordering(true);
        try {
            const newArtworks = [...artworks];
            const targetIndex = direction === "up" ? index - 1 : index + 1;
            [newArtworks[index], newArtworks[targetIndex]] = [newArtworks[targetIndex], newArtworks[index]];
            setArtworks(newArtworks);

            const batch = writeBatch(db);
            newArtworks.forEach((item, idx) => {
                batch.update(doc(db, "catalog", item.id), { order: idx });
            });
            await batch.commit();
        } catch (error) {
            console.error("Move failed:", error);
            showToast("Failed to reorder", "error");
            fetchArtworks();
        } finally {
            setReordering(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Catalog"
                description="Manage artworks for the art fair."
                actionLabel="Add Artwork"
                actionHref="/admin/catalog/editor?id=new"
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artworks.map((artwork, index) => (
                        <div
                            key={artwork.id}
                            className="bg-white rounded-xl border border-[#002FA7]/10 hover:border-[#002FA7] transition-all duration-300 group relative flex flex-col overflow-hidden hover:shadow-[0_0_30px_rgba(0,47,167,0.08)]"
                        >
                            {/* Image */}
                            <div className="h-56 w-full bg-[#002FA7]/5 relative overflow-hidden">
                                {artwork.mainImage ? (
                                    <Image
                                        src={artwork.mainImage}
                                        alt={artwork.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#002FA7]/20">
                                        <Palette size={32} strokeWidth={1} />
                                        <span className="text-[10px] font-mono mt-2 uppercase tracking-widest">No Image</span>
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                    <div className="flex bg-white/90 backdrop-blur rounded-lg">
                                        <button
                                            onClick={() => handleMove(index, "up")}
                                            disabled={index === 0}
                                            className="p-2 text-[#002FA7] hover:bg-[#002FA7] hover:text-white transition-colors rounded-l-lg disabled:opacity-30"
                                            title="Move Previous"
                                        >
                                            <ArrowLeft size={14} />
                                        </button>
                                        <div className="w-px bg-gray-200" />
                                        <button
                                            onClick={() => handleMove(index, "down")}
                                            disabled={index === artworks.length - 1}
                                            className="p-2 text-[#002FA7] hover:bg-[#002FA7] hover:text-white transition-colors rounded-r-lg disabled:opacity-30"
                                            title="Move Next"
                                        >
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                    <Link
                                        href={`/admin/catalog/editor?id=${artwork.id}`}
                                        className="p-2 bg-white/90 backdrop-blur text-[#002FA7] rounded-lg hover:bg-[#002FA7] hover:text-white transition-colors shadow-lg"
                                    >
                                        <Edit size={14} />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(artwork.id)}
                                        className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4">
                                    <StatusBadge status={artwork.status} />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-[#002FA7] leading-tight mb-1 line-clamp-2">{artwork.title}</h3>
                                <p className="text-sm text-[#002FA7]/60 font-medium mb-3">{artwork.artist || "Unknown Artist"}</p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-[#002FA7]/50">
                                        <span>{artwork.medium || "—"}</span>
                                        <span className="w-1 h-1 bg-[#002FA7]/30 rounded-full" />
                                        <span>{artwork.year || "—"}</span>
                                    </div>
                                    <span className="text-[10px] text-[#002FA7]/30 font-mono">#{index + 1}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {artworks.length === 0 && (
                        <div className="col-span-full p-20 text-center flex flex-col items-center justify-center border border-dashed border-[#002FA7]/20 rounded-xl bg-[#F4F4F2]">
                            <Palette size={48} className="mx-auto text-[#002FA7]/20 mb-4" />
                            <p className="text-[#002FA7]/40 font-mono text-sm uppercase tracking-widest mb-4">No artworks in catalog</p>
                            <Link
                                href="/admin/catalog/editor?id=new"
                                className="px-6 py-3 bg-[#002FA7] text-white rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
                            >
                                Add Artwork
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Artwork?"
                description="This action cannot be undone. This will permanently remove the artwork from the catalog."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </div>
    );
}
