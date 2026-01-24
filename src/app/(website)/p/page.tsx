"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useVisualEditor } from "@/components/admin/visual/VisualEditorContext";
import VisualBlock from "@/components/admin/visual/VisualBlock";
import PageBuilder from "@/components/admin/visual/PageBuilder";

function PageViewerContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const [rawPage, setRawPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Get Visual Editor context
    const { isEditing, setCurrentDoc } = useVisualEditor();

    // Register Doc
    useEffect(() => {
        if (slug) {
            setCurrentDoc({ id: slug, path: "pages" });
        }
    }, [slug, setCurrentDoc]);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        const fetchPage = async () => {
            try {
                const docRef = doc(db, "pages", slug);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRawPage(docSnap.data());
                    setError(false);
                } else {
                    setError(true); // Page doesn't exist
                    setRawPage(null);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-white">
                <span className="animate-pulse">Loading Page...</span>
            </div>
        );
    }

    if (!slug) {
        return <div>No slug provided.</div>;
    }

    // Airlock Logic: Merge Draft
    // If creating new page (error=true), we fallback to empty object if isEditing, else 404.
    if ((error || !rawPage) && !isEditing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-4">
                <h1 className="text-4xl font-bold uppercase text-zinc-500">Page Not Found</h1>
                <p className="text-zinc-600">The requested page "{slug}" does not exist.</p>
                <a href="/" className="text-nava-green hover:underline uppercase text-sm font-bold">Return Home</a>
            </div>
        );
    }

    const liveData = rawPage || { blocks: [] };
    const displayData = (isEditing && liveData.draft) ? { ...liveData, ...liveData.draft } : liveData;

    // Ensure blocks array exists
    const finalBlocks = displayData.blocks || [];

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-16 min-h-[60vh]">
            {/* If creating new (and not yet saved even to draft), show a hint */}
            {error && isEditing && finalBlocks.length === 0 && (
                <div className="bg-nava-green text-black p-4 font-bold uppercase text-center mb-8">
                    New Page: {slug} — Add blocks to start.
                </div>
            )}

            {/* Dynamic Page Builder - 100% Control */}
            <div className="w-full">
                <PageBuilder
                    id={slug}
                    path="pages"
                    blocks={finalBlocks}
                />
            </div>
        </div>
    );
}

export default function PageViewer() {
    return (
        <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
            <PageViewerContent />
        </Suspense>
    );
}
