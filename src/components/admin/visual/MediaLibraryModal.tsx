"use client";

import { useEffect, useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

interface AssetItem {
    id: string;
    url: string;
    filename: string;
    type: string;
    createdAt?: any;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
    const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
    const [assets, setAssets] = useState<AssetItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Assets
    useEffect(() => {
        if (!isOpen) return;

        const q = query(collection(db, "assets"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AssetItem[];
            setAssets(items);
        });

        return () => unsubscribe();
    }, [isOpen]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Upload to Storage
            // Path: uploads/YYYY/MM/filename-timestamp
            const date = new Date();
            const path = `uploads/${date.getFullYear()}/${date.getMonth() + 1}/${file.name}-${Date.now()}`;
            const storageRef = ref(storage, path);

            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // 2. Add to Registry
            await addDoc(collection(db, "assets"), {
                url: downloadURL,
                path: path,
                filename: file.name,
                type: file.type,
                createdAt: serverTimestamp()
            });

            // 3. Auto-Select or Switch to Library
            setActiveTab("library");
            // Optional: onSelect(downloadURL); onClose(); to select immediately

        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                    <h2 className="font-bold uppercase tracking-wider text-white">Asset Vault</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-800 bg-zinc-900">
                    <button
                        onClick={() => setActiveTab("library")}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === "library" ? "bg-zinc-800 text-nava-green border-b-2 border-nava-green" : "text-zinc-500 hover:text-white"}`}
                    >
                        Library
                    </button>
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === "upload" ? "bg-zinc-800 text-nava-green border-b-2 border-nava-green" : "text-zinc-500 hover:text-white"}`}
                    >
                        Upload New
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-zinc-900">
                    {activeTab === "library" && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {assets.length === 0 && (
                                <div className="col-span-full py-12 text-center text-zinc-600 font-mono text-sm">
                                    No assets found in the vault.
                                </div>
                            )}
                            {assets.map(asset => (
                                <button
                                    key={asset.id}
                                    onClick={() => { onSelect(asset.url); onClose(); }}
                                    className="group relative aspect-square bg-black border border-zinc-800 rounded overflow-hidden hover:border-nava-green transition-all focus:outline-none focus:ring-2 focus:ring-nava-green"
                                >
                                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-end p-2 transition-opacity">
                                        <p className="text-[10px] text-white truncate w-full font-mono">{asset.filename}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === "upload" && (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors bg-black/20">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />

                            {uploading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-2 border-nava-green border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-zinc-400 font-mono uppercase text-xs animate-pulse">Uploading...</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-zinc-400 mb-4 font-mono uppercase text-xs">Drop files here or</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-nava-green text-black px-8 py-3 rounded font-bold uppercase hover:bg-white transition-colors"
                                    >
                                        Select File
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
