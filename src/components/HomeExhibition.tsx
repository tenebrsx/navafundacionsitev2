"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import MagneticButton from "@/components/anim/MagneticButton";
import Image from "next/image";

export default function HomeExhibition() {
    const [exhibition, setExhibition] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExhibition = async () => {
            try {
                // 1. Priority: Check for explicitly FEATURED event
                try {
                    const qFeatured = query(
                        collection(db, "events"),
                        where("status", "==", "published"),
                        where("featured", "==", true),
                        limit(1)
                    );
                    const snapshotFeatured = await getDocs(qFeatured);

                    if (!snapshotFeatured.empty) {
                        setExhibition({
                            id: snapshotFeatured.docs[0].id,
                            ...snapshotFeatured.docs[0].data(),
                        });
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.log("Featured query failed (likely index missing), falling back to latest.");
                }

                // 2. Fallback: Get most recent published event
                const q = query(
                    collection(db, "events"),
                    where("status", "==", "published"),
                    orderBy("date", "desc"),
                    limit(1)
                );
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    setExhibition({
                        id: snapshot.docs[0].id,
                        ...snapshot.docs[0].data(),
                    });
                }
            } catch (error) {
                console.error("Error fetching exhibition:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExhibition();
    }, []);

    // Skeleton while loading
    if (loading || !exhibition) {
        return (
            <div className="py-12 md:py-24 border-b border-[#002FA7] flex flex-col md:flex-row gap-8 md:gap-12 px-4 sm:px-12 md:px-24">
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <span className="font-mono text-xs uppercase tracking-widest block opacity-50">On View</span>
                    <div className="h-10 w-3/4 bg-[#002FA7]/5 animate-pulse"></div>
                    <div className="h-4 w-full bg-[#002FA7]/5 animate-pulse mt-4"></div>
                    <div className="h-4 w-2/3 bg-[#002FA7]/5 animate-pulse"></div>
                </div>
                <div className="w-full md:w-2/3 h-[400px] md:h-[600px] bg-[#E5E5E0] animate-pulse border border-[#002FA7]/10"></div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-24 border-b border-[#002FA7] flex flex-col md:flex-row gap-8 md:gap-12 px-4 sm:px-12 md:px-24">
            <div className="w-full md:w-1/3 flex flex-col justify-between">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest block mb-4 opacity-50">On View</span>
                    <h2 className="text-3xl md:text-4xl text-[#002FA7]">
                        {exhibition.title}
                    </h2>
                </div>
                <p className="mt-8 text-sm md:text-base leading-relaxed opacity-80 max-w-xs font-sans line-clamp-4">
                    {exhibition.description || "No description available."}
                </p>
            </div>

            <div className="w-full md:w-2/3 h-[400px] md:h-[600px] bg-[#E5E5E0] relative overflow-hidden group border border-[#002FA7]/10">
                {exhibition.image && (
                    <Image
                        src={exhibition.image}
                        alt={exhibition.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                )}

                <div className="absolute inset-0 bg-[#002FA7]/5 group-hover:bg-[#002FA7]/0 transition-colors duration-500"></div>

                <div className="absolute bottom-6 right-6">
                    <MagneticButton>
                        <Link href={`/events/${exhibition.id}`}>
                            <button className="bg-white text-[#002FA7] px-6 py-3 rounded-full uppercase text-xs tracking-widest font-bold hover:bg-[#002FA7] hover:text-white transition-colors">
                                View Exhibition
                            </button>
                        </Link>
                    </MagneticButton>
                </div>
            </div>
        </div>
    );
}
