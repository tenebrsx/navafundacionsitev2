"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import MagneticButton from "@/components/anim/MagneticButton";

interface CatalogItem {
    id: string;
    title: string;
    mainImage: string;
}

export default function HomeCatalog() {
    const [items, setItems] = useState<CatalogItem[]>([]);
    const trackRef = useRef<HTMLDivElement>(null);
    const isInteracting = useRef(false);
    const rafId = useRef<number>(0);
    const speed = 0.5; // px per frame

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const q = query(
                    collection(db, "catalog"),
                    where("status", "==", "published")
                );
                const snapshot = await getDocs(q);
                const results = snapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((item: any) => item.mainImage) as CatalogItem[];

                setItems(results);
            } catch (error) {
                console.error("Error fetching catalog:", error);
            }
        };

        fetchCatalog();
    }, []);

    // Infinite scroll loop driven by requestAnimationFrame
    const animate = useCallback(() => {
        const el = trackRef.current;
        if (el && !isInteracting.current) {
            el.scrollLeft += speed;

            // When we've scrolled past the first set of items, silently jump back
            const halfScroll = el.scrollWidth / 2;
            if (el.scrollLeft >= halfScroll) {
                el.scrollLeft -= halfScroll;
            }
        }
        rafId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (items.length === 0) return;
        rafId.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId.current);
    }, [items, animate]);

    // Pause auto-scroll on interaction
    const handlePointerDown = () => { isInteracting.current = true; };
    const handlePointerUp = () => { isInteracting.current = false; };

    // Don't render the section if there are no items
    if (items.length === 0) return null;

    // Triple the list for a wide buffer so manual scrolling never hits an edge
    const marqueeItems = [...items, ...items, ...items, ...items];

    return (
        <section className="py-10 md:py-16 border-b border-[#002FA7] overflow-hidden">

            {/* Header row */}
            <div className="flex items-end justify-between px-4 sm:px-12 md:px-24 mb-6 md:mb-8">
                <span className="font-mono text-xs uppercase tracking-widest opacity-50">
                    On Display
                </span>
                <MagneticButton>
                    <Link
                        href="/catalog"
                        className="uppercase tracking-widest text-xs font-bold text-[#002FA7] hover:underline decoration-1 underline-offset-4"
                    >
                        View Catalog
                    </Link>
                </MagneticButton>
            </div>

            {/* Scrollable + auto-animated track */}
            <div
                ref={trackRef}
                className="overflow-x-auto cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchEnd={handlePointerUp}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
                <div className="flex gap-3 md:gap-4 pl-4 sm:pl-12 md:pl-24 pr-4 sm:pr-12 md:pr-24 w-max">
                    {marqueeItems.map((item, i) => (
                        <Link
                            key={`${item.id}-${i}`}
                            href={`/catalog/${item.id}`}
                            className="flex-shrink-0 w-[140px] md:w-[180px] lg:w-[220px] aspect-[3/4] relative overflow-hidden bg-zinc-100 group"
                            draggable={false}
                        >
                            <Image
                                src={item.mainImage}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 220px"
                                draggable={false}
                            />
                        </Link>
                    ))}
                </div>
            </div>

        </section>
    );
}
