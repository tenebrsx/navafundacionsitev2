"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavaLoadingSpinner from "@/components/anim/NavaLoadingSpinner";

/**
 * PageTransition — shows the branded spinner briefly on route changes.
 * Listens to pathname changes via Next.js usePathname().
 */
export default function PageTransition() {
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [prevPath, setPrevPath] = useState(pathname);

    useEffect(() => {
        // Skip on initial mount (LoadingScreen handles that)
        if (pathname === prevPath) return;

        setPrevPath(pathname);
        setIsTransitioning(true);
        setFadeOut(false);

        // Brief pause then fade out
        const fadeTimer = setTimeout(() => setFadeOut(true), 400);
        const removeTimer = setTimeout(() => {
            setIsTransitioning(false);
            setFadeOut(false);
        }, 800);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [pathname, prevPath]);

    if (!isTransitioning) return null;

    return <NavaLoadingSpinner fadeOut={fadeOut} />;
}
