"use client";

import { createContext, useContext, ReactNode } from "react";

interface BlockContextType {
    id: string; // Doc ID
    path: string; // Collection Path
    fieldPath?: string;
    customId?: string; // Instance ID
    data: any; // Live Data (Draft or Live)
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

export function BlockProvider({ children, value }: { children: ReactNode, value: BlockContextType }) {
    return (
        <BlockContext.Provider value={value}>
            {children}
        </BlockContext.Provider>
    );
}

export function useBlock() {
    return useContext(BlockContext);
}
