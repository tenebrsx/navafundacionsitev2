"use client";

import Link from "next/link";
import { useVisualEditor } from "./VisualEditorContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BLOCK_REGISTRY } from "./registry";

export default function AdminSidebar() {
    const { isEditing, toggleEditing, orderedBlocks, addBlockToPage, publishCurrentDoc, discardCurrentDraft } = useVisualEditor();
    const pathname = usePathname();
    const [pagesOpen, setPagesOpen] = useState(true);
    const [addMenuOpen, setAddMenuOpen] = useState(false);

    if (!isEditing) {
        // When NOT editing, show a small trigger button at bottom left
        // UNLESS we are on an admin page (which has its own layout)
        if (pathname.startsWith("/admin")) return null;

        return (
            <button
                onClick={toggleEditing}
                className="fixed bottom-6 left-6 z-50 bg-black text-white px-4 py-2 font-bold uppercase border border-nava-green shadow-xl hover:bg-nava-green hover:text-black transition-colors flex items-center gap-2"
            >
                <span className="w-2 h-2 bg-nava-green rounded-full animate-pulse"></span>
                Edit Site
            </button>
        );
    }

    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 z-[90] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
                <h1 className="text-xl font-black uppercase text-white tracking-tighter">
                    <span className="text-nava-green">Nava</span><br />Editor
                </h1>
            </div>

            {/* Navigation */}
            <div className="flex-grow overflow-y-auto py-6">

                {/* Main Links */}
                <div className="px-4 mb-8 flex flex-col gap-2">
                    <Link href="/admin" className="text-zinc-400 hover:text-white text-sm font-bold uppercase flex items-center gap-3 p-2 rounded hover:bg-zinc-900 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Dashboard
                    </Link>
                </div>

                {/* Pages List */}
                <div className="px-4 mb-8">
                    <button
                        onClick={() => setPagesOpen(!pagesOpen)}
                        className="w-full text-xs font-mono text-zinc-500 uppercase font-bold mb-4 flex justify-between items-center hover:text-white"
                    >
                        Pages
                        <span>{pagesOpen ? "−" : "+"}</span>
                    </button>

                    {pagesOpen && (
                        <div className="flex flex-col gap-1 ml-2 border-l border-zinc-800 pl-4">
                            <Link href="/" className={`text-sm font-bold uppercase p-2 rounded block transition-colors ${pathname === "/" ? "text-nava-green" : "text-zinc-400 hover:text-white"}`}>
                                Home
                            </Link>
                            <Link href="/about" className={`text-sm font-bold uppercase p-2 rounded block transition-colors ${pathname === "/about" ? "text-nava-green" : "text-zinc-400 hover:text-white"}`}>
                                About
                            </Link>
                            <Link href="/mission" className={`text-sm font-bold uppercase p-2 rounded block transition-colors ${pathname === "/mission" ? "text-nava-green" : "text-zinc-400 hover:text-white"}`}>
                                Mission
                            </Link>
                            <Link href="/team" className={`text-sm font-bold uppercase p-2 rounded block transition-colors ${pathname === "/team" ? "text-nava-green" : "text-zinc-400 hover:text-white"}`}>
                                Team
                            </Link>
                            <Link href="/info" className={`text-sm font-bold uppercase p-2 rounded block transition-colors ${pathname === "/info" ? "text-nava-green" : "text-zinc-400 hover:text-white"}`}>
                                Info
                            </Link>
                        </div>
                    )}
                </div>

                {/* Current Page Blocks (Layers) */}
                <div className="px-4 mb-8">
                    <p className="text-xs font-mono text-zinc-500 uppercase font-bold mb-4">Page Layers</p>

                    {/* List existing blocks */}
                    <div className="flex flex-col gap-1 mb-6">
                        {orderedBlocks && orderedBlocks.length > 0 ? orderedBlocks.map((block: any, i: number) => {
                            // Scroll to block on click
                            const handleClick = () => {
                                if (block.ref) {
                                    block.ref.scrollIntoView({ behavior: "smooth", block: "center" });
                                    // Optional: Flash visual indicator
                                    block.ref.click(); // Trigger selection logic in VisualBlock
                                }
                            };

                            return (
                                <button
                                    key={block.id || i}
                                    onClick={handleClick}
                                    className={`
                                        w-full p-2 border border-zinc-900 bg-zinc-900/50 rounded flex items-center justify-between
                                        text-xs text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-left
                                        ${block.isLocked ? "opacity-75" : ""}
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-nava-green">#{i + 1}</span>
                                        <span className="uppercase truncate max-w-[120px]">{block.label || block.type}</span>
                                    </div>
                                    {block.isLocked && (
                                        <span title="Locked Layout" className="text-zinc-500">🔒</span>
                                    )}
                                </button>
                            )
                        }) : (
                            <div className="text-zinc-600 text-xs italic p-2">No blocks on this page.</div>
                        )}
                    </div>

                    {/* Toolbox: Add New */}
                    <button
                        onClick={() => setAddMenuOpen(!addMenuOpen)}
                        className="w-full bg-nava-green text-black text-xs font-bold uppercase py-2 rounded hover:bg-white transition-colors flex justify-between px-3 items-center"
                    >
                        + Add Block
                        <span>{addMenuOpen ? "−" : "+"}</span>
                    </button>

                    {addMenuOpen && (
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {Object.entries(BLOCK_REGISTRY).map(([key, def]) => (
                                <button
                                    key={key}
                                    onClick={() => addBlockToPage(key)}
                                    className="text-left bg-zinc-900 border border-zinc-800 p-3 rounded hover:border-nava-green group transition-all"
                                >
                                    <div className="text-xs font-bold text-white uppercase group-hover:text-nava-green">{def.label}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Events Shortcut */}
                <div className="px-4 mb-8">
                    <p className="text-xs font-mono text-zinc-500 uppercase font-bold mb-4">Content</p>
                    <Link href="/admin/events" className="text-zinc-400 hover:text-white text-sm font-bold uppercase flex items-center gap-3 p-2 rounded hover:bg-zinc-900 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        All Events
                    </Link>
                </div>
            </div>

            {/* Footer / Exit */}
            <div className="p-4 border-t border-zinc-800 bg-black flex flex-col gap-3">
                {/* Airlock Controls */}
                <button
                    onClick={publishCurrentDoc}
                    className="w-full bg-white text-black font-bold uppercase py-3 rounded hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse"
                >
                    Publish Changes
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={discardCurrentDraft}
                        className="flex-1 bg-zinc-900 text-zinc-400 font-mono text-xs uppercase py-2 rounded hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={toggleEditing}
                        className="flex-1 bg-red-900/30 text-red-500 font-mono text-xs uppercase py-2 rounded hover:bg-red-900/50 transition-colors"
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
}
