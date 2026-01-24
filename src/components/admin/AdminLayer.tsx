"use client";

import { VisualEditorProvider, useVisualEditor } from "./visual/VisualEditorContext";
import EditorSidebar from "./visual/EditorSidebar"; // Right Sidebar
import AdminSidebar from "./visual/AdminSidebar"; // Left Sidebar
import { ReactNode } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
    const { isEditing, selectedBlock } = useVisualEditor();

    // Calculate layout shift
    // Left sidebar is 64 (w-64 = 16rem = 256px). 
    // Right sidebar is 96 (w-96 = 24rem = 384px).

    const mainStyle = {
        paddingLeft: isEditing ? "256px" : "0px",
        paddingRight: (isEditing && selectedBlock) ? "384px" : "0px",
        transition: "all 300ms ease-in-out"
    };

    return (
        <>
            <div style={mainStyle} className="min-h-screen">
                {children}
            </div>
            <AdminSidebar />
            <EditorSidebar />
        </>
    );
}

export default function AdminLayer({ children }: { children: ReactNode }) {
    return (
        <VisualEditorProvider>
            <AdminLayout>{children}</AdminLayout>
        </VisualEditorProvider>
    );
}
