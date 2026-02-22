"use client";

import { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    /** Small helper text below the input */
    hint?: string;
    /** Error message — overrides hint when present */
    error?: string;
    /** Whether to show character count (pass current length and max) */
    charCount?: { current: number; max: number };
    /** Makes the field span full width in a grid */
    fullWidth?: boolean;
    /** Required indicator */
    required?: boolean;
}

/**
 * Consistent field wrapper with label, input slot, optional hint/error, and character count.
 */
export default function FormField({
    label,
    children,
    hint,
    error,
    charCount,
    fullWidth,
    required,
}: FormFieldProps) {
    return (
        <div className={`space-y-1.5 ${fullWidth ? "col-span-full" : ""}`}>
            <label className="flex items-baseline gap-1 text-[11px] font-bold uppercase text-gray-400 tracking-[0.12em]">
                {label}
                {required && <span className="text-red-400 text-[10px]">*</span>}
            </label>
            {children}
            <div className="flex items-center justify-between gap-2">
                {error ? (
                    <p className="text-[10px] text-red-500 font-medium">{error}</p>
                ) : hint ? (
                    <p className="text-[10px] text-gray-400">{hint}</p>
                ) : (
                    <div />
                )}
                {charCount && (
                    <p className={`text-[10px] font-mono tabular-nums ${charCount.current > charCount.max ? "text-red-500" : "text-gray-300"
                        }`}>
                        {charCount.current}/{charCount.max}
                    </p>
                )}
            </div>
        </div>
    );
}

/**
 * Consistent input class names for text inputs, textareas, and selects.
 * Use these to ensure unified focus states across all editors.
 */
export const inputStyles =
    "w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]/10 focus:bg-white transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300";

export const inputStylesLg =
    "w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]/10 focus:bg-white transition-all text-lg font-bold text-gray-900 placeholder:text-gray-300";

export const textareaStyles =
    "w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]/10 focus:bg-white transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300 resize-y min-h-[120px]";

export const selectStyles =
    "w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]/10 focus:bg-white transition-all text-sm font-medium text-gray-800 appearance-none cursor-pointer";
