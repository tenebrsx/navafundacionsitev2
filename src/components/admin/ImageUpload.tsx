"use client";

import { useState } from "react";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    currentImage?: string;
    label?: string;
}

export default function ImageUpload({ onUpload, currentImage, label = "Upload Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || "");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediately
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        // TODO: These should be environmental variables or constants
        // For now, we use placeholders that the user will need to replace
        const CLOUD_NAME = "YOUR_CLOUD_NAME";
        const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onUpload(data.secure_url);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed. Please check your Cloudinary configuration.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="block text-xs uppercase text-zinc-500 mb-1">{label}</label>

            <div className="flex items-start gap-4">
                {preview && (
                    <div className="w-24 h-24 bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-700 border-dashed hover:border-nava-green hover:bg-zinc-900 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <p className="text-sm text-nava-green animate-pulse">Uploading...</p>
                            ) : (
                                <>
                                    <p className="mb-2 text-sm text-zinc-400 group-hover:text-white uppercase font-bold">Click to upload</p>
                                    <p className="text-xs text-zinc-600">SVG, PNG, JPG or GIF</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>
            {currentImage && (
                <p className="text-[10px] items-center text-zinc-600 font-mono truncate max-w-xs">
                    Current: {currentImage}
                </p>
            )}
        </div>
    );
}
