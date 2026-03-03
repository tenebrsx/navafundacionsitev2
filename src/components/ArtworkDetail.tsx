"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import MagneticButton from "./anim/MagneticButton";

interface Artwork {
    id: string;
    title: string;
    artist: string;
    medium: string;
    dimensions: string;
    year: string;
    description: string;
    price: string;
    priceOnRequest: boolean;
    mainImage: string;
    gallery: string[];
    status: string;
}

export default function ArtworkDetail({ id: propId }: { id: string }) {
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        // Read the real ID from the URL path (Firebase rewrite may serve a fallback page
        // where the server-rendered prop doesn't match the actual requested ID).
        const segments = window.location.pathname.split("/").filter(Boolean);
        const realId = segments.length >= 2 && segments[0] === "catalog" ? segments[1] : propId;

        const fetchArtwork = async () => {
            if (!realId) return;
            setLoading(true);
            try {
                const docRef = doc(db, "catalog", realId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setArtwork({ id: snap.id, ...snap.data() } as Artwork);
                }
            } catch (error) {
                console.error("Error fetching artwork:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtwork();
    }, [propId]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: artwork?.title, url });
            } catch { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-mono text-[#002FA7] animate-pulse text-sm uppercase tracking-widest">Loading...</p>
            </div>
        );
    }

    if (!artwork) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[#002FA7] gap-6">
                <h1 className="text-4xl font-normal">Artwork Not Found</h1>
                <Link
                    href="/catalog"
                    className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-6 py-3 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors"
                >
                    Return to Catalog
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen text-[#002FA7]">
            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-12"
            >
                <MagneticButton>
                    <Link href="/catalog" className="flex items-center gap-2 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-xs uppercase tracking-widest">Back to Catalog</span>
                    </Link>
                </MagneticButton>
                <div className="flex gap-4">
                    <MagneticButton>
                        <button
                            onClick={handleShare}
                            className="p-2 border border-[#002FA7] rounded-full hover:bg-[#002FA7] hover:text-[#F4F4F2] transition-colors"
                        >
                            <Share2 size={16} />
                        </button>
                    </MagneticButton>
                </div>
            </motion.div>

            {/* Main Image */}
            {artwork.mainImage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="w-full aspect-[4/3] md:aspect-[16/9] bg-zinc-100 mb-12 relative overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(artwork.mainImage)}
                >
                    <Image
                        src={artwork.mainImage}
                        alt={artwork.title}
                        fill
                        className="object-cover hover:scale-[1.02] transition-transform duration-700"
                        sizes="100vw"
                        priority
                    />
                </motion.div>
            )}

            {/* Identity & Meta Grid (Screenshot Style) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-16"
            >
                {/* 1. Artist & Origin Line */}
                <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                    <span className="text-[#002FA7] font-semibold">{artwork.artist}</span>
                    <span className="text-black/20">•</span>
                    <span className="text-black/40 lowercase normal-case tracking-normal">b. Dominican Republic</span>
                </div>

                {/* 2. Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#002FA7] max-w-4xl mb-10"
                >
                    {artwork.title}
                </motion.h1>

                {/* Top Divider */}
                <div className="w-full h-px bg-[#002FA7]/20 mb-8"></div>

                {/* 3. Meta Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 mb-8">

                    {/* Row 1 */}
                    <div>
                        <span className="font-mono text-[10px] uppercase text-black/40 tracking-widest block mb-2">Year</span>
                        <span className="text-lg font-medium text-[#111]">{artwork.year || "—"}</span>
                    </div>
                    <div>
                        <span className="font-mono text-[10px] uppercase text-black/40 tracking-widest block mb-2">Dimensions</span>
                        <span className="text-lg font-medium text-[#111]">{artwork.dimensions || "—"}</span>
                    </div>

                    {/* Row 2 */}
                    <div className="md:col-span-2">
                        <span className="font-mono text-[10px] uppercase text-black/40 tracking-widest block mb-2">Medium</span>
                        <span className="text-lg font-medium text-[#111]">{artwork.medium || "—"}</span>
                    </div>

                    {/* Row 3 (Edition / Price) */}
                    <div className="md:col-span-2">
                        <span className="font-mono text-[10px] uppercase text-black/40 tracking-widest block mb-2">Price</span>
                        <span className="text-lg font-medium text-[#111]">
                            {artwork.priceOnRequest ? "Price on Request" : artwork.price || "—"}
                        </span>
                    </div>

                </div>

                {/* Bottom Divider */}
                <div className="w-full h-px bg-[#002FA7]/20"></div>
            </motion.div>

            {/* Description */}
            {artwork.description && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-24"
                >
                    <div className="md:col-span-4">
                        <span className="font-mono text-xs uppercase tracking-widest opacity-50 block mb-6">About This Work</span>
                    </div>
                    <div className="md:col-span-8">
                        <div className="prose prose-lg max-w-none">
                            {artwork.description.split("\n").map((paragraph, idx) => (
                                <p key={idx} className="text-[#002FA7] leading-relaxed mb-6 text-lg">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Gallery */}
            {artwork.gallery && artwork.gallery.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="space-y-12 mb-24"
                >
                    <div className="border-t border-[#002FA7] pt-4">
                        <span className="font-mono text-xs uppercase tracking-widest opacity-50 block mb-8">Additional Views</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {artwork.gallery.map((img, i) => (
                            <div
                                key={i}
                                className="aspect-[4/3] bg-zinc-100 relative overflow-hidden cursor-pointer group"
                                onClick={() => setSelectedImage(img)}
                            >
                                <Image
                                    src={img}
                                    alt={`${artwork.title} - View ${i + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Lightbox */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="relative max-w-5xl max-h-[90vh] w-full h-full"
                    >
                        <Image
                            src={selectedImage}
                            alt="Full view"
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </motion.div>
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white text-sm font-mono uppercase tracking-widest"
                        onClick={() => setSelectedImage(null)}
                    >
                        Close ×
                    </button>
                </motion.div>
            )}
        </article>
    );
}
