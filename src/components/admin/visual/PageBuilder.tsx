"use client";

import { useState, useEffect } from "react";
import { useVisualEditor } from "./VisualEditorContext";
import VisualBlock from "./VisualBlock";
import { BLOCK_REGISTRY } from "./registry";
import { doc, updateDoc, arrayUnion } from "firebase/firestore"; // Use getDoc, etc from actual implementation
import { db } from "@/lib/firebase";
import { getDoc } from "firebase/firestore";

interface PageBuilderProps {
    id: string; // Doc ID
    path: string; // Collection Path
    blocks: any[]; // Array of block objects { id, type, data }
}

export default function PageBuilder({ id, path, blocks }: PageBuilderProps) {
    const { isEditing, addBlockRequest, clearAddBlockRequest, setCurrentDoc } = useVisualEditor();

    // State
    const [localBlocks, setLocalBlocks] = useState(blocks);
    const [deletedBlockState, setDeletedBlockState] = useState<any[] | null>(null);
    const [showUndo, setShowUndo] = useState(false);

    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [insertIndex, setInsertIndex] = useState<number | null>(null);

    // Register Document for Airlock
    useEffect(() => {
        if (id && path) {
            setCurrentDoc({ id, path });
        }
    }, [id, path, setCurrentDoc]);

    // Sync props to local state
    useEffect(() => {
        setLocalBlocks(blocks);
    }, [blocks]);

    // Handle "Add Block" request from Sidebar
    useEffect(() => {
        if (addBlockRequest) {
            handleAddBlock(addBlockRequest);
            clearAddBlockRequest();
        }
    }, [addBlockRequest]);

    // Helper to update the ENTIRE blocks array in Firestore
    const updateBlocks = async (newBlocks: any[]) => {
        // Optimistic Update
        setLocalBlocks(newBlocks);

        try {
            await updateDoc(doc(db, path, id), {
                "draft.blocks": newBlocks
            });
            // No reload needed
        } catch (error) {
            console.error("Error updating blocks:", error);
            alert("Failed to save changes.");
            setLocalBlocks(blocks); // Revert on error
        }
    };

    const handleAddBlock = async (type: string) => {
        const def = BLOCK_REGISTRY[type];
        if (!def) return;

        const newBlock = {
            id: Date.now().toString(),
            type,
            data: { ...def.defaultData }
        };

        let newBlocks = [...localBlocks];
        if (insertIndex !== null) {
            newBlocks.splice(insertIndex, 0, newBlock);
        } else {
            newBlocks.push(newBlock);
        }

        await updateBlocks(newBlocks);
        setIsAddMenuOpen(false);
    };

    const handleRemoveBlock = async (blockId: string) => {
        // Save state for Undo
        setDeletedBlockState([...localBlocks]);
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 5000); // Hide after 5s

        const newBlocks = localBlocks.filter(b => b.id !== blockId);
        await updateBlocks(newBlocks);
    };

    const handleUndo = async () => {
        if (deletedBlockState) {
            await updateBlocks(deletedBlockState);
            setDeletedBlockState(null);
            setShowUndo(false);
        }
    };

    const handleMoveBlock = async (index: number, direction: -1 | 1) => {
        const newBlocks = [...localBlocks];
        if (index + direction < 0 || index + direction >= newBlocks.length) return;

        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;

        await updateBlocks(newBlocks);
    };

    const openAddMenu = (index: number) => {
        setInsertIndex(index);
        setIsAddMenuOpen(true);
    };

    return (
        <div className="flex flex-col gap-0 pb-24">
            {/* If empty, show initial add button */}
            {localBlocks.length === 0 && isEditing && (
                <div className="py-12 flex justify-center border-2 border-dashed border-zinc-800 rounded-lg">
                    <button
                        onClick={() => openAddMenu(0)}
                        className="bg-nava-green text-black px-6 py-3 font-bold uppercase hover:bg-white"
                    >
                        + Add First Block
                    </button>
                </div>
            )}

            {localBlocks.map((block, index) => {
                const def = BLOCK_REGISTRY[block.type];
                if (!def) return <div key={block.id || index} className="p-4 text-red-500">Unknown Block Type: {block.type}</div>;

                return (
                    <div key={block.id || index} className="relative group">

                        {/* Editor Controls Overlay */}
                        {isEditing && (
                            <div className="absolute top-4 right-4 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, -1); }}
                                    disabled={index === 0}
                                    className="bg-black text-white p-2 rounded hover:bg-nava-green hover:text-black disabled:opacity-50"
                                    title="Move Up"
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 1); }}
                                    disabled={index === localBlocks.length - 1}
                                    className="bg-black text-white p-2 rounded hover:bg-nava-green hover:text-black disabled:opacity-50"
                                    title="Move Down"
                                >
                                    ↓
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveBlock(block.id); }}
                                    className="bg-red-600 text-white p-2 rounded hover:bg-red-500"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* The Block Content */}
                        <VisualBlock
                            id={id}
                            path={path}
                            // Custom Save Logic similar to VisualBlockList
                            data={block.data}
                            schema={def.schema}
                            customSave={async (newData) => {
                                // We need to update this specific block inside the blocks array
                                // Reading fresh doc to ensure safety
                                const docRef = doc(db, path, id);
                                const snap = await getDoc(docRef);
                                if (!snap.exists()) return;

                                const currentDoc = snap.data();
                                // Move 2: Airlock - Read from draft if available, or fall back to live to start a draft
                                const currentBlocks = currentDoc.draft?.blocks || currentDoc.blocks || [];
                                const idx = currentBlocks.findIndex((b: any) => b.id === block.id);

                                if (idx !== -1) {
                                    currentBlocks[idx] = {
                                        ...currentBlocks[idx],
                                        data: { ...currentBlocks[idx].data, ...newData }
                                    };
                                    // Update local state too to keep in sync without reload
                                    const updatedLocal = [...localBlocks];
                                    updatedLocal[index] = currentBlocks[idx];
                                    setLocalBlocks(updatedLocal);

                                    await updateDoc(docRef, { "draft.blocks": currentBlocks });
                                }
                            }}
                            render={(data) => {
                                const Component = def.component;
                                return <Component data={data} />;
                            }}
                        />

                        {/* Insertion Point (Post-block) */}
                        {isEditing && (
                            <div className="h-4 -mb-2 relative z-40 group/insert flex items-center justify-center cursor-pointer hover:h-8 transition-all">
                                <div className="w-full h-px bg-nava-green opacity-0 group-hover/insert:opacity-100 absolute top-1/2 left-0 right-0"></div>
                                <button
                                    onClick={() => openAddMenu(index + 1)}
                                    className="bg-nava-green text-black text-xs font-bold uppercase px-3 py-1 rounded-full opacity-0 group-hover/insert:opacity-100 transform scale-0 group-hover/insert:scale-100 transition-all z-10 shadow-lg"
                                >
                                    + Add Block Here
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Block Picker Modal */}
            {isAddMenuOpen && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={() => setIsAddMenuOpen(false)}>
                    <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl p-8 rounded-xl shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold uppercase text-white mb-6 border-b border-zinc-800 pb-4">Choose a Block</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(BLOCK_REGISTRY).map(([key, def]) => (
                                <button
                                    key={key}
                                    onClick={() => handleAddBlock(key)}
                                    className="bg-black border border-zinc-800 p-6 hover:border-nava-green hover:bg-zinc-900 transition-all text-left group"
                                >
                                    <h4 className="text-lg font-bold uppercase text-white group-hover:text-nava-green mb-2">{def.label}</h4>
                                    <p className="text-zinc-500 text-sm">Click to add this block type.</p>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 text-right">
                            <button onClick={() => setIsAddMenuOpen(false)} className="text-zinc-500 hover:text-white uppercase font-bold text-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Undo Toast */}
            {showUndo && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[200] bg-zinc-900 border border-zinc-800 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
                    <span className="text-sm font-bold uppercase">Block Deleted</span>
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
