"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";
import Link from "next/link";

interface MenuLink {
    label: string;
    href: string;
}

interface MenuColumn {
    id: string;
    title: string;
    links: MenuLink[];
}

const defaultMenu: MenuColumn[] = [
    {
        id: "about",
        title: "About",
        links: [
            { label: "Mission", href: "/mission" },
            { label: "Team", href: "/team" },
            { label: "History", href: "/about" }
        ]
    },
    {
        id: "programs",
        title: "Programs",
        links: [
            { label: "Events", href: "/events" },
            { label: "Exhibitions", href: "/events" },
            { label: "Research", href: "/events" }
        ]
    },
    {
        id: "involve",
        title: "Get Involved",
        links: [
            { label: "Mailing List", href: "/info" },
            { label: "Contact", href: "/info" },
            { label: "Admin", href: "/admin" }
        ]
    }
];

export default function AdminNavigation() {
    const [columns, setColumns] = useState<MenuColumn[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Load initial data
    useEffect(() => {
        const fetchNav = async () => {
            try {
                const docRef = doc(db, "content", "navigation");
                const snap = await getDoc(docRef);
                if (snap.exists() && snap.data().columns) {
                    setColumns(snap.data().columns);
                } else {
                    // Start with defaults if empty
                    setColumns(defaultMenu);
                }
            } catch (error) {
                console.error("Error loading navigation:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNav();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "content", "navigation"), { columns });
            setMessage("Menu Configuration Saved!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error saving:", error);
            alert("Failed to save menu configuration.");
        } finally {
            setSaving(false);
        }
    };

    // Column Actions
    const addColumn = () => {
        setColumns([...columns, {
            id: Date.now().toString(),
            title: "New Column",
            links: []
        }]);
    };

    const removeColumn = (index: number) => {
        if (!confirm("Delete this entire column?")) return;
        const newCols = [...columns];
        newCols.splice(index, 1);
        setColumns(newCols);
    };

    const updateColumnTitle = (index: number, title: string) => {
        const newCols = [...columns];
        newCols[index].title = title;
        setColumns(newCols);
    };

    // Link Actions
    const addLink = (colIndex: number) => {
        const newCols = [...columns];
        newCols[colIndex].links.push({ label: "New Link", href: "/" });
        setColumns(newCols);
    };

    const removeLink = (colIndex: number, linkIndex: number) => {
        const newCols = [...columns];
        newCols[colIndex].links.splice(linkIndex, 1);
        setColumns(newCols);
    };

    const updateLink = (colIndex: number, linkIndex: number, field: keyof MenuLink, value: string) => {
        const newCols = [...columns];
        newCols[colIndex].links[linkIndex][field] = value;
        setColumns(newCols);
    };

    const moveLink = (colIndex: number, linkIndex: number, direction: -1 | 1) => {
        const newCols = [...columns];
        const links = newCols[colIndex].links;
        if (linkIndex + direction < 0 || linkIndex + direction >= links.length) return;

        const temp = links[linkIndex];
        links[linkIndex] = links[linkIndex + direction];
        links[linkIndex + direction] = temp;
        setColumns(newCols);
    };

    if (loading) return <div className="p-8 text-white">Loading Navigation...</div>;

    return (
        <AdminGuard>
            <div className="p-8 max-w-6xl mx-auto text-white pb-24">
                <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
                    <div>
                        <Link href="/admin" className="text-zinc-500 hover:text-white mb-2 text-sm inline-block">← Dashboard</Link>
                        <h1 className="text-4xl font-bold uppercase text-nava-green">Menu Editor</h1>
                        <p className="text-zinc-400 text-sm mt-1">Configure the main navigation overlay.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-3 font-bold uppercase transition-colors disabled:opacity-50 ${message ? "bg-white text-black" : "bg-nava-green text-black hover:bg-white"}`}
                    >
                        {saving ? "Saving..." : message || "Save Changes"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {columns.map((col, colIndex) => (
                        <div key={col.id} className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg relative group">
                            <button
                                onClick={() => removeColumn(colIndex)}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-red-500"
                                title="Remove Column"
                            >
                                ✕
                            </button>

                            <input
                                type="text"
                                value={col.title}
                                onChange={(e) => updateColumnTitle(colIndex, e.target.value)}
                                className="bg-transparent border-b border-zinc-700 mb-6 w-full pb-2 text-sm font-mono uppercase text-zinc-500 focus:text-white focus:border-nava-green outline-none"
                                placeholder="COLUMN TITLE"
                            />

                            <div className="flex flex-col gap-4">
                                {col.links.map((link, linkIndex) => (
                                    <div key={linkIndex} className="bg-black/50 p-4 border border-zinc-800 rounded flex flex-col gap-2 relative group/link">
                                        <div className="flex justify-between items-start gap-2">
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => updateLink(colIndex, linkIndex, "label", e.target.value)}
                                                className="bg-transparent text-xl font-bold uppercase text-white w-full outline-none placeholder-zinc-700"
                                                placeholder="Link Label"
                                            />
                                            <button
                                                onClick={() => removeLink(colIndex, linkIndex)}
                                                className="text-zinc-600 hover:text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={link.href}
                                            onChange={(e) => updateLink(colIndex, linkIndex, "href", e.target.value)}
                                            className="bg-transparent text-xs font-mono text-nava-green w-full outline-none"
                                            placeholder="/path/to/page"
                                        />

                                        <div className="flex gap-2 mt-1 opacity-0 group-hover/link:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => moveLink(colIndex, linkIndex, -1)}
                                                disabled={linkIndex === 0}
                                                className="text-xs text-zinc-500 hover:text-white disabled:opacity-20"
                                            >
                                                ↑ Up
                                            </button>
                                            <button
                                                onClick={() => moveLink(colIndex, linkIndex, 1)}
                                                disabled={linkIndex === col.links.length - 1}
                                                className="text-xs text-zinc-500 hover:text-white disabled:opacity-20"
                                            >
                                                ↓ Down
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => addLink(colIndex)}
                                className="w-full mt-6 py-2 border border-dashed border-zinc-700 text-zinc-500 hover:text-nava-green hover:border-nava-green uppercase text-xs font-bold transition-all"
                            >
                                + Add Link
                            </button>
                        </div>
                    ))}

                    {/* Add Column Button */}
                    <button
                        onClick={addColumn}
                        className="h-full min-h-[300px] border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-white hover:border-zinc-600 transition-all rounded-lg uppercase font-bold"
                    >
                        + Add Column
                    </button>
                </div>
            </div>
        </AdminGuard>
    );
}
