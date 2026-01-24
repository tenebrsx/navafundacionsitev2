"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlockSchema {
    [key: string]: {
        type: "text" | "textarea" | "image" | "color" | "select" | "boolean" | "link" | "date";
        label: string;
        options?: { label: string; value: any }[];
    };
}

interface SelectedBlock {
    id: string; // Doc ID
    path: string; // Collection Path
    fieldPath?: string; // Optional nested field inside the doc
    customId?: string; // Unique ID for this block instance (for arrays)
    schema: BlockSchema;
    data: any;
    customSave?: (newData: any) => Promise<void>;
}

interface VisualEditorContextType {
    isEditing: boolean;
    toggleEditing: () => void;

    selectedBlock: SelectedBlock | null;
    selectBlock: (block: SelectedBlock) => void;
    closeSidebar: () => void;

    drafts: Record<string, any>;
    updateDraft: (block: SelectedBlock, newData: any) => void;
    getDraft: (id: string, path: string, fieldPath?: string, customId?: string) => any;

    // Registry for Ghost Layers
    orderedBlocks: RegisteredBlock[];
    registerBlock: (id: string, meta: BlockMeta, ref: HTMLElement) => void;
    unregisterBlock: (id: string) => void;

    // Add Block Request
    addBlockToPage: (type: string) => void;
    addBlockRequest: string | null;
    clearAddBlockRequest: () => void;

    // Airlock: Publish
    currentDoc: { path: string; id: string } | null;
    setCurrentDoc: (doc: { path: string; id: string }) => void;
    publishCurrentDoc: () => Promise<void>;
    discardCurrentDraft: () => Promise<void>;
}

interface BlockMeta {
    type: string;
    label?: string;
    isLocked?: boolean;
    data?: any;
}

interface RegisteredBlock extends BlockMeta {
    id: string;
    ref: HTMLElement;
}

const VisualEditorContext = createContext<VisualEditorContextType | undefined>(undefined);

export function VisualEditorProvider({ children }: { children: ReactNode }) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<SelectedBlock | null>(null);
    const [drafts, setDrafts] = useState<Record<string, any>>({});

    // The Registry: Map<BlockID, BlockData>
    const [registry, setRegistry] = useState<Map<string, RegisteredBlock>>(new Map());
    const [orderedBlocks, setOrderedBlocks] = useState<RegisteredBlock[]>([]);

    const [addBlockRequest, setAddBlockRequest] = useState<string | null>(null);
    const [currentDoc, setCurrentDoc] = useState<{ path: string; id: string } | null>(null);

    // Compute Ordered Blocks whenever registry changes
    useEffect(() => {
        const blocks = Array.from(registry.values());

        // Sort by DOM position
        if (blocks.length > 0) {
            blocks.sort((a, b) => {
                if (!a.ref || !b.ref) return 0;
                return (a.ref.compareDocumentPosition(b.ref) & Node.DOCUMENT_POSITION_PRECEDING) ? 1 : -1;
            });
        }
        setOrderedBlocks(blocks);
    }, [registry]);

    const registerBlock = (id: string, meta: BlockMeta, ref: HTMLElement) => {
        setRegistry(prev => {
            const next = new Map(prev);
            next.set(id, { id, ref, ...meta });
            return next;
        });
    };

    const unregisterBlock = (id: string) => {
        setRegistry(prev => {
            const next = new Map(prev);
            next.delete(id);
            return next;
        });
    };

    const toggleEditing = () => {
        setIsEditing(prev => {
            if (prev) {
                setSelectedBlock(null);
                setDrafts({});
            }
            return !prev;
        });
    };

    const selectBlock = (block: SelectedBlock) => {
        if (!isEditing) return;
        setSelectedBlock(block);
        const key = getBlockKey(block);
        if (!drafts[key]) {
            setDrafts(prev => ({ ...prev, [key]: block.data }));
        }
    };

    const updateDraft = (block: SelectedBlock, newData: any) => {
        const key = getBlockKey(block);
        setDrafts(prev => ({ ...prev, [key]: newData }));
    };

    const getDraft = (id: string, path: string, fieldPath?: string, customId?: string) => {
        return drafts[`${path}:${id}:${customId || fieldPath || ""}`];
    };

    const closeSidebar = () => {
        setSelectedBlock(null);
    };

    const addBlockToPage = (type: string) => {
        setAddBlockRequest(type);
    };

    // Helper to generate unique key for drafts
    const getBlockKey = (b: { id: string, path: string, fieldPath?: string, customId?: string }) =>
        `${b.path}:${b.id}:${b.customId || b.fieldPath || ""}`;

    const publishCurrentDoc = async () => {
        if (!currentDoc) return;
        try {
            const docRef = doc(db, currentDoc.path, currentDoc.id);
            const snap = await getDoc(docRef);
            if (!snap.exists()) return;

            const data = snap.data();
            const draft = data.draft;
            if (!draft) return;

            // Merge draft into root (top-level fields)
            // Note: This relies on draft structure mirroring root.
            // e.g. draft: { blocks: [...] } -> blocks: [...]
            await updateDoc(docRef, {
                ...draft,
                draft: deleteField() // Create fresh start
            });

            window.location.reload();

        } catch (e) {
            console.error("Publish Failed", e);
            alert("Publish Failed");
        }
    };

    const discardCurrentDraft = async () => {
        if (!currentDoc) return;
        if (!confirm("Discard all unpublished changes?")) return;
        try {
            const docRef = doc(db, currentDoc.path, currentDoc.id);
            await updateDoc(docRef, {
                draft: deleteField()
            });
            window.location.reload();
        } catch (e) {
            console.error("Discard Failed", e);
        }
    };

    return (
        <VisualEditorContext.Provider value={{
            isEditing,
            toggleEditing,
            selectedBlock,
            selectBlock,
            closeSidebar,
            drafts,
            updateDraft,
            getDraft,
            orderedBlocks,
            registerBlock,
            unregisterBlock,
            addBlockToPage: (type: string) => setAddBlockRequest(type),
            addBlockRequest,
            clearAddBlockRequest: () => setAddBlockRequest(null),
            currentDoc,
            setCurrentDoc,
            publishCurrentDoc,
            discardCurrentDraft
        } as any}>
            {children}
        </VisualEditorContext.Provider>
    );
}

export function useVisualEditor() {
    const context = useContext(VisualEditorContext);
    if (context === undefined) {
        throw new Error("useVisualEditor must be used within a VisualEditorProvider");
    }
    return context;
}
