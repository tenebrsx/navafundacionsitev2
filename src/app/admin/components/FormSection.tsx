"use client";

import { ReactNode } from "react";

interface FormSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
    /** Use "sidebar" for sidebar cards with tighter padding */
    variant?: "main" | "sidebar";
    /** Optional icon to display beside the title */
    icon?: ReactNode;
}

/**
 * Card wrapper for grouping related form fields.
 * Provides consistent borders, padding, and optional section title.
 */
export default function FormSection({
    title,
    description,
    children,
    variant = "main",
    icon,
}: FormSectionProps) {
    const padding = variant === "sidebar" ? "p-5" : "p-6 md:p-8";

    return (
        <div className={`bg-white ${padding} rounded-xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5`}>
            {(title || description) && (
                <div className="space-y-1">
                    {title && (
                        <div className="flex items-center gap-2">
                            {icon && <span className="text-[#002FA7]/60">{icon}</span>}
                            <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-[0.15em]">
                                {title}
                            </h3>
                        </div>
                    )}
                    {description && (
                        <p className="text-xs text-gray-400">{description}</p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}
