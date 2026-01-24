"use client";

import { useVisualEditor } from "./VisualEditorContext";
import VisualBlock from "./VisualBlock";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface VisualBlockListProps {
    id: string; // Doc ID
    path: string; // Collection Path
    fieldPath: string; // The field name that contains the ARRAY of objects
    items: any[]; // The generic array
    itemSchema: any; // Schema for individual items
    renderItem: (data: any, index: number) => React.ReactNode;
    defaultItemData?: any; // Data to initialize new items with
    direction?: "column" | "row" | "grid";
    className?: string;
}

export default function VisualBlockList({
    id,
    path,
    fieldPath,
    items = [],
    itemSchema,
    renderItem,
    defaultItemData = {},
    direction = "column",
    className = ""
}: VisualBlockListProps) {
    const { isEditing, selectBlock, setCurrentDoc } = useVisualEditor();

    // State
    const [localItems, setLocalItems] = useState(items);
    const [deletedItemState, setDeletedItemState] = useState<any[] | null>(null);
    const [showUndo, setShowUndo] = useState(false);

    // Register Document for Airlock
    useEffect(() => {
        if (id && path) {
            setCurrentDoc({ id, path });
        }
    }, [id, path, setCurrentDoc]);

    // Sync props
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const updateFirestore = async (newItems: any[]) => {
        try {
            const docRef = doc(db, path, id);
            // Airlock Move 2: Always save to draft field
            // We use dot notation. "draft" field will act as our sandbox.
            // If fieldPath is "blogPosts", we save to "draft.blogPosts".
            await updateDoc(docRef, {
                [`draft.${fieldPath}`]: newItems
            });
        } catch (err) {
            console.error("Error updating list:", err);
            alert("Error saving list changes");
            setLocalItems(localItems); // Revert
        }
    };

    const handleAddItem = async () => {
        const newItem = {
            id: Date.now().toString(),
            ...defaultItemData
        };

        const updatedList = [...localItems, newItem];
        setLocalItems(updatedList); // Optimistic

        await updateFirestore(updatedList);
    };

    const handleRemoveItem = async (itemToRemove: any) => {
        // Save state for undo
        setDeletedItemState([...localItems]);
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 5000);

        const updatedList = localItems.filter(i => i.id !== itemToRemove.id);
        setLocalItems(updatedList); // Optimistic

        await updateFirestore(updatedList);
    };

    const handleUndo = async () => {
        if (deletedItemState) {
            setLocalItems(deletedItemState);
            await updateFirestore(deletedItemState);
            setDeletedItemState(null);
            setShowUndo(false);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className={`${direction === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-12"}`}>
                {localItems.map((item, index) => (
                    <div key={item.id || index} className="relative group">
                        {/* Remove Button */}
                        {isEditing && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveItem(item); }}
                                className="absolute -top-4 -left-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center z-50 hover:bg-red-700 shadow-md"
                                title="Remove Block"
                            >
                                -
                            </button>
                        )}

                        <VisualBlock
                            id={id}
                            path={path}
                            data={item}
                            schema={itemSchema}
                            customSave={async (newData) => {
                                // Logic to update THIS item in the array
                                // Move 2: Airlock - updates go to draft
                                const currentArray = [...localItems];
                                const idx = currentArray.findIndex((x: any) => x.id === item.id);
                                if (idx !== -1) {
                                    currentArray[idx] = { ...currentArray[idx], ...newData };
                                    setLocalItems(currentArray); // Optimistic Update
                                    await updateFirestore(currentArray);
                                }
                            }}
                            render={(data) => renderItem(data, index)}
                        />
                    </div>
                ))}
            </div>

            {/* Add Button */}
            {isEditing && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleAddItem}
                        className="bg-nava-green text-black px-6 py-3 rounded-full font-bold uppercase hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                    >
                        <span className="text-xl leading-none">+</span> Add item
                    </button>
                </div>
            )}

            {/* Undo Toast */}
            {showUndo && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[200] bg-zinc-900 border border-zinc-800 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
                    <span className="text-sm font-bold uppercase">Item Deleted</span>
                    <button
                        onClick={handleUndo}
                        className="bg-nava-green text-black px-4 py-1 rounded-full text-xs font-black uppercase hover:bg-white transition-colors"
                    >
                        Undo
                    </button>
                    <button onClick={() => setShowUndo(false)} className="text-zinc-500 hover:text-white">✕</button>
                </div>
            )}
        </div>
    );
}
