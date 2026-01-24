"use client";

import { ReactNode, useRef, useEffect } from "react";
import { useVisualEditor } from "./VisualEditorContext";
import { BlockProvider } from "./BlockContext";

interface VisualBlockProps {
    id: string; // Doc ID
    path: string; // Collection Path
    fieldPath?: string; // Optional nested field
    schema: any;
    data: any;
    render: (data: any) => ReactNode;
    className?: string;
    customSave?: (newData: any) => Promise<void>;
    isLocked?: boolean; // New prop for Ghost Layers
    label?: string; // Optional label for sidebar
}

export default function VisualBlock({
    id,
    path,
    fieldPath,
    schema,
    data,
    render,
    className = "",
    customSave,
    isLocked = false,
    label
}: VisualBlockProps) {
    const { isEditing, selectBlock, selectedBlock, getDraft, registerBlock, unregisterBlock } = useVisualEditor();
    const blockRef = useRef<HTMLDivElement>(null);

    // Identify Block
    const uniqueBlockId = data.id || fieldPath || `block-${Math.random().toString(36).substr(2, 9)}`;
    // Note: Random ID is risky for persistence in list if re-renders happen.
    // Ideally parent provides ID.

    const isSelected = selectedBlock?.customId === uniqueBlockId;

    // Register Ghost Layer
    useEffect(() => {
        if (blockRef.current) {
            registerBlock(uniqueBlockId, {
                type: data.type || "block",
                label: label || data.title || (fieldPath ? fieldPath : "Content Block"),
                isLocked,
                data
            }, blockRef.current);
        }
        return () => unregisterBlock(uniqueBlockId);
    }, [uniqueBlockId, label, isLocked, data.type, data.title]); // Re-register if metadata changes

    // Get live draft data if it exists, otherwise fall back to original data
    const draftData = getDraft(id, path, fieldPath, uniqueBlockId);
    const displayData = isEditing && draftData ? draftData : data;

    const blockContextValue = {
        id,
        path,
        fieldPath,
        customId: uniqueBlockId,
        data: displayData
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!isEditing) return;
        e.stopPropagation();
        e.preventDefault();
        // const currentData = draftData || data; // No longer needed, use displayData

        selectBlock({
            id,
            path,
            fieldPath,
            schema,
            data: displayData, // Use displayData
            customSave, // Pass this along!
            customId: uniqueBlockId // Identify this block instance
        });
    };

    if (!isEditing) {
        // Even when not editing, we want to register it?
        // Ghost Layers should probably appear always or only in Edit Mode?
        // User requested "The sidebar will list EVERYTHING". Sidebar is only visible in Edit Mode.
        // So we only need to register if `isEditing` is accessible?
        // Wait, context `isEditing` toggles UI.
        // If we want the sidebar to populate *immediately* when we toggle Edit Mode,
        // the blocks need to register *even if isEditing is false* (so the map is ready),
        // OR they register on mount regardless.
        // Let's register always.
        // But the Wrapper DIV is needed for the ref.
        // If we don't render the wrapper div in non-edit mode, we have no ref.
        // Users might object to extra <div> in production.
        // "Efficient solution" -> Only render wrapper in Edit Mode?
        // Then Sidebar is empty until we toggle Edit Mode.
        // When we toggle Edit Mode, a re-render happens?
        // If `VisualBlock` listens to `isEditing`, yes.

        return (
            <div ref={blockRef} className={className}>
                <BlockProvider value={blockContextValue}>
                    {render(displayData)}
                </BlockProvider>
            </div>
        );
    }

    return (
        <div
            ref={blockRef}
            onClick={handleClick}
            className={`
                relative transition-all duration-200 cursor-pointer
                ${className}
                ${isEditing ? "hover:outline hover:outline-2 hover:outline-nava-green hover:outline-offset-2" : ""}
                ${isSelected ? "outline outline-2 outline-nava-green outline-offset-2 ring-4 ring-black/50" : ""}
            `}
        >
            {/* Edit Badge */}
            <div className={`
                absolute -top-3 -right-3 z-50 bg-nava-green text-black text-[10px] font-bold px-2 py-1 uppercase rounded-sm shadow-md pointer-events-none opacity-0 transition-opacity
                ${isEditing ? "group-hover:opacity-100" : ""}
                ${isSelected ? "opacity-100" : ""}
            `}>
                {isLocked ? "Locked" : "Edit"}
            </div>

            {/* Render children with live data */}
            <BlockProvider value={blockContextValue}>
                {render(displayData)}
            </BlockProvider>
        </div>
    );
}
