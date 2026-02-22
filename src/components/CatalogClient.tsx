"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface Artwork {
    id: string;
    title: string;
    artist: string;
    medium: string;
    year: string;
    mainImage: string;
    status: string;
    order?: number;
}

export default function CatalogClient() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const q = query(collection(db, "catalog"));
                const snapshot = await getDocs(q);
                let data = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Artwork))
                    .filter(a => a.status === "published");

                data.sort((a, b) => {
                    const orderA = typeof a.order === "number" ? a.order : 9999;
                    const orderB = typeof b.order === "number" ? b.order : 9999;
                    return orderA - orderB;
                });

                setArtworks(data);
            } catch (error) {
                console.error("Error fetching catalog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const item = {
        hidden: { y: 30, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-[3/4] bg-[#002FA7]/5 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (artworks.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto text-center py-32">
                <p className="text-[#002FA7]/40 font-mono text-sm uppercase tracking-widest">
                    No artworks available at this time.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-mono text-xs uppercase tracking-[0.3em] text-[#002FA7]/50 mb-4"
                >
                    Art Fair Collection
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.85] text-[#002FA7]"
                >
                    Catalog
                </motion.h1>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full h-px bg-[#002FA7]/20 mt-8 origin-left"
                />
            </div>

            {/* Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
            >
                {artworks.map((artwork) => (
                    <motion.div key={artwork.id} variants={item}>
                        <Link
                            href={`/catalog/${artwork.id}`}
                            className="group block"
                        >
                            {/* Image */}
                            <div className="relative aspect-[3/4] bg-[#002FA7]/5 rounded-sm overflow-hidden mb-5">
                                {artwork.mainImage ? (
                                    <Image
                                        src={artwork.mainImage}
                                        alt={artwork.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#002FA7]/15">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                        </svg>
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-[#002FA7]/0 group-hover:bg-[#002FA7]/10 transition-colors duration-500" />

                                {/* View label */}
                                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <span className="bg-white/90 backdrop-blur-sm text-[#002FA7] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                                        View Details
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-[#002FA7] leading-tight group-hover:opacity-70 transition-opacity">
                                    {artwork.title}
                                </h3>
                                <p className="text-sm text-[#002FA7]/60">
                                    {artwork.artist}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] font-mono text-[#002FA7]/40 uppercase tracking-wider pt-1">
                                    <span>{artwork.medium || "—"}</span>
                                    {artwork.year && (
                                        <>
                                            <span className="w-1 h-1 bg-[#002FA7]/20 rounded-full" />
                                            <span>{artwork.year}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
