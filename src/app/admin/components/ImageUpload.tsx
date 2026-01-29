"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
}

export default function ImageUpload({ value, onChange, folder = "uploads" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            // Create a unique filename: folder/timestamp-filename
            const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(prog);
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert(`Upload failed: ${error.message}. Since you are in Production Mode, you likely need to update your Storage Rules to 'allow read, write: if request.auth != null;'`);
                    setUploading(false);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        onChange(url);
                    } catch (err) {
                        console.error("Error getting download URL", err);
                        alert("Upload succeeded but failed to get URL.");
                    } finally {
                        setUploading(false);
                    }
                }
            );
        } catch (error: any) {
            console.error("Upload setup failed:", error);
            alert(`Failed to start upload. Error: ${error.message || "Unknown error"}`);
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
        setProgress(0);
    };

    return (
        <div className="flex flex-col gap-4">
            {value ? (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                    <Image
                        src={value}
                        alt="Uploaded content"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <label className={`
                    border-2 border-dashed border-gray-300 rounded-lg p-8 
                    flex flex-col items-center justify-center gap-2 cursor-pointer
                    hover:border-[#002FA7] hover:bg-blue-50 transition-colors
                    ${uploading ? "opacity-50 pointer-events-none" : ""}
                `}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-[#002FA7]" size={32} />
                            <span className="text-xs font-mono text-[#002FA7]">{Math.round(progress)}%</span>
                        </div>
                    ) : (
                        <Upload className="text-gray-400" size={32} />
                    )}
                    <span className="text-gray-500 font-medium text-sm">
                        {uploading ? "Uploading..." : "Click to Upload Image"}
                    </span>
                    {uploading && (
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-2 max-w-[100px]">
                            <div
                                className="h-full bg-[#002FA7] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </label>
            )}
        </div>
    );
}
