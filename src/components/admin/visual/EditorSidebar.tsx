"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; // Ensure updateDoc is imported
import { db } from "@/lib/firebase";
import { useVisualEditor } from "./VisualEditorContext";
import MediaLibraryModal from "./MediaLibraryModal";

export default function EditorSidebar() {
    const { selectedBlock, closeSidebar, updateDraft } = useVisualEditor();
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Media Library State
    const [isMediaVisible, setIsMediaVisible] = useState(false);
    const [activeImageField, setActiveImageField] = useState<string | null>(null);

    // Load data when block selected
    useEffect(() => {
        if (selectedBlock) {
            setFormData(selectedBlock.data);
        }
    }, [selectedBlock]);

    // Handle Live Updates
    const handleChange = (key: string, value: any) => {
        const newData = { ...formData, [key]: value };
        setFormData(newData);
        if (selectedBlock) {
            updateDraft(selectedBlock, newData); // Broadcast to context
        }
    };

    if (!selectedBlock) return null;

    const handleSave = async () => {
        setSaving(true);
        console.log("Saving block:", selectedBlock);

        try {
            const docRef = doc(db, selectedBlock.path, selectedBlock.id);

            // Airlock Move 2: Enforce Draft Writes
            // Custom Save Logic (e.g. for Array Items)
            if (selectedBlock.customSave) {
                await selectedBlock.customSave(formData);
            }
            // Nested Field Logic
            else if (selectedBlock.fieldPath) {
                // Write to draft.[fieldPath]
                await setDoc(docRef, {
                    draft: {
                        [selectedBlock.fieldPath]: formData
                    }
                }, { merge: true });
            } else {
                // Root level simple merge -> write to draft
                await setDoc(docRef, {
                    draft: formData
                }, { merge: true });
            }

            // Success Feedback (No Alert)
            setMessage("Saved!");
            setTimeout(() => setMessage(""), 2000);

        } catch (error: any) {
            console.error("Error saving:", error);
            alert(`Error saving content: ${error.message || error.code || "Unknown error"}`);
        } finally {
            setSaving(false);
        }
    };



    return (
        <div className="fixed top-0 right-0 h-full w-96 bg-zinc-900 border-l border-zinc-800 shadow-2xl z-[100] p-6 overflow-y-auto transform transition-transform duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                <h2 className="text-xl font-bold uppercase text-nava-green">Edit Block</h2>
                <button onClick={closeSidebar} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-6 flex-grow">
                {Object.entries(selectedBlock.schema).map(([key, field]) => (
                    <div key={key}>
                        <label className="block text-xs uppercase text-zinc-500 mb-1">{field.label}</label>

                        {field.type === "text" && (
                            <input
                                type="text"
                                value={formData[key] || ""}
                                onChange={e => handleChange(key, e.target.value)}
                                className="w-full bg-black border border-zinc-700 p-2 text-white outline-none focus:border-nava-green"
                            />
                        )}

                        {field.type === "textarea" && (
                            <textarea
                                rows={4}
                                value={formData[key] || ""}
                                onChange={e => handleChange(key, e.target.value)}
                                className="w-full bg-black border border-zinc-700 p-2 text-white outline-none focus:border-nava-green text-sm"
                            />
                        )}

                        {field.type === "image" && (
                            <div className="flex flex-col gap-3">
                                {formData[key] ? (
                                    <div className="relative aspect-video bg-black border border-zinc-800 rounded overflow-hidden group">
                                        <img src={formData[key]} className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handleChange(key, "")}
                                                className="text-white text-xs uppercase font-bold hover:text-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-[3/2] bg-zinc-950 border-2 border-dashed border-zinc-800 rounded flex items-center justify-center text-zinc-600 text-xs font-mono uppercase">
                                        No Image Selected
                                    </div>
                                )}
                                <button
                                    onClick={() => { setActiveImageField(key); setIsMediaVisible(true); }}
                                    className="bg-zinc-800 text-white w-full py-2 text-xs font-bold uppercase rounded hover:bg-zinc-700 border border-zinc-700 hover:border-nava-green transition-all"
                                >
                                    {formData[key] ? "Replace from Vault" : "Select from Vault"}
                                </button>
                            </div>
                        )}

                        {field.type === "link" && (
                            <input
                                type="text"
                                value={formData[key] || ""}
                                onChange={e => handleChange(key, e.target.value)}
                                className="w-full bg-black border border-zinc-700 p-2 text-nava-green font-mono text-xs outline-none focus:border-white"
                                placeholder="/example-page"
                            />
                        )}

                        {field.type === "date" && (
                            <input
                                type="date"
                                value={formData[key] || ""}
                                onChange={e => handleChange(key, e.target.value)}
                                className="w-full bg-black border border-zinc-700 p-2 text-white outline-none focus:border-nava-green uppercase font-mono"
                            />
                        )}

                        {field.type === "color" && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={formData[key] || "#ffffff"}
                                    onChange={e => handleChange(key, e.target.value)}
                                    className="h-10 w-10 border border-zinc-700 bg-black cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData[key] || ""}
                                    onChange={e => handleChange(key, e.target.value)}
                                    className="flex-grow bg-black border border-zinc-700 p-2 text-white font-mono text-xs outline-none focus:border-nava-green"
                                    placeholder="#000000"
                                />
                            </div>
                        )}

                        {field.type === "boolean" && (
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData[key] ? "bg-nava-green" : "bg-zinc-700"}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData[key] ? "translate-x-4" : ""}`} />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={!!formData[key]}
                                    onChange={e => handleChange(key, e.target.checked)}
                                    className="hidden"
                                />
                                <span className={`text-sm font-bold uppercase transition-colors ${formData[key] ? "text-white" : "text-zinc-500"}`}>
                                    {formData[key] ? "Enabled" : "Disabled"}
                                </span>
                            </label>
                        )}

                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full font-bold uppercase py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2
                        ${message ? "bg-white text-black" : "bg-nava-green text-black hover:bg-white"}
                    `}
                >
                    {saving ? "Saving..." : message || "Save Changes"}
                </button>
            </div>
        </div>
    );
}
