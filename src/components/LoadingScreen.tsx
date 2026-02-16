"use client";

import { useState, useEffect } from "react";
import NavaLoadingSpinner from "@/components/anim/NavaLoadingSpinner";

/**
 * Client-side loading screen wrapper.
 * Renders outside SmoothScroll so `position: fixed` isn't broken by transforms.
 */
export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeOut(true), 1200);
        const removeTimer = setTimeout(() => setLoading(false), 1800);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!loading) return null;

    return <NavaLoadingSpinner fadeOut={fadeOut} />;
}
