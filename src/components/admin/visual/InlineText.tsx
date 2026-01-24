"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { useVisualEditor } from "./VisualEditorContext";
import { useBlock } from "./BlockContext";

interface InlineTextProps {
    field: string;
    as?: string;
    className?: string;
    placeholder?: string;
}

export default function InlineText({ field, as = "span", className = "", placeholder }: InlineTextProps) {
    const { isEditing, updateDraft } = useVisualEditor();
    const block = useBlock();
    const ref = useRef<HTMLElement>(null);

    // Initial value from block data
    const initialValue = block?.data?.[field] || "";

    // We keep a local state for the input to avoid cursor jumping issues with React re-renders on contentEditable
    // But we also need to sync if external data changes (e.g. undo)
    // Actually, "controlled" contentEditable is hard.
    // Making it "uncontrolled" but syncing on blur is safer.
    // Or syncing on input but not re-rendering the innerText heavily.

    const handleInput = (e: React.FormEvent<HTMLElement>) => {
        if (!block) return;
        const newValue = e.currentTarget.innerText;

        // Update the draft context globally
        // We construct the new data object
        const newData = { ...block.data, [field]: newValue };

        // We need to pass a "SelectedBlock" structure to updateDraft
        // We cast block to any or fit the shape
        updateDraft({
            id: block.id,
            path: block.path,
            fieldPath: block.fieldPath,
            customId: block.customId,
            schema: {}, // Schema not needed for key generation
            data: newData
        } as any, newData);
    };

    if (!isEditing || !block) {
        return createElement(as, { className }, initialValue || placeholder);
    }

    return createElement(as, {
        ref,
        className: `${className} outline-none focus:ring-2 focus:ring-nava-green/50 rounded px-1 -mx-1 transition-all empty:before:content-[attr(placeholder)] empty:before:text-gray-400 cursor-text`,
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: handleInput,
        onBlur: handleInput, // Ensure final sync
        placeholder: placeholder,
        // We prioritize local edits via contentEditable, but use key to force reset if block ID changes
        // Using `dangerouslySetInnerHTML` is one way to init, or just children.
        // Children is safer for XSS if we trust the source.
    }, initialValue);
}
