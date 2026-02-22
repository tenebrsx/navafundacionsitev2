"use client";

import { ReactNode } from "react";

interface EditorLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
}

/**
 * Standardized editor layout with main content (2/3) and sidebar (1/3).
 * Ensures all editors share the same structural foundation.
 */
export default function EditorLayout({ children, sidebar }: EditorLayoutProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 px-8 md:px-12 pb-28">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
                {children}
            </div>

            {/* Sidebar — sticky so it follows scroll on long forms */}
            <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
                {sidebar}
            </div>
        </div>
    );
}
