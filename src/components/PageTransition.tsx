"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NavaLoadingSpinner from "@/components/anim/NavaLoadingSpinner";

/**
 * PageTransition — shows the branded spinner briefly on route changes.
 * Much faster than the initial load (0.5s total).
 */
export default function PageTransition() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const isFirstRender = useRef(true);
    const prevPath = useRef(pathname);

    useEffect(() => {
        // Skip the very first render (LoadingScreen handles the initial load)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Only trigger on actual path changes
        if (pathname === prevPath.current) return;
        prevPath.current = pathname;

        // Show spinner
        setVisible(true);
        setFadeOut(false);

        // Start fading out after 200ms
        const fadeTimer = setTimeout(() => setFadeOut(true), 200);
        // Remove completely after 500ms
        const removeTimer = setTimeout(() => {
            setVisible(false);
            setFadeOut(false);
        }, 500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [pathname]);

    if (!visible) return null;

    return <NavaLoadingSpinner fadeOut={fadeOut} />;
}
