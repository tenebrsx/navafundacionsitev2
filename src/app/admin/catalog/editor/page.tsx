"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, FormActions } from "../../components/AdminShared";
import ImageUpload from "../../components/ImageUpload";
import EditorLayout from "../../components/EditorLayout";
import FormSection from "../../components/FormSection";
import FormField, { inputStyles, inputStylesLg, textareaStyles } from "../../components/FormField";
import ToggleSwitch from "../../components/ToggleSwitch";
import { X, Download, QrCode, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import QRCode from "qrcode";

const SITE_DOMAIN = typeof window !== "undefined" ? window.location.origin : "https://nava-fundacion.org";

function CatalogEditor() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paramId = searchParams.get("id");
    const isNew = !paramId || paramId === "new";

    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isNew);

    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        medium: "",
        dimensions: "",
        year: new Date().getFullYear().toString(),
        description: "",
        price: "",
        priceOnRequest: false,
        mainImage: "",
        gallery: [] as string[],
        status: "draft",
        featured: false,
    });

    // QR Code state
    const [qrDataUrl, setQrDataUrl] = useState<string>("");

    // Auto-Save Hook
    const { saveStatus, docId, triggerSave } = useAutoSave("catalog", isNew ? "new" : paramId, formData, isNew);

    // Determine the active ID for QR generation
    const activeId = docId || paramId;

    // Generate QR code whenever activeId changes
    useEffect(() => {
        if (activeId && activeId !== "new") {
            const url = `${SITE_DOMAIN}/catalog/${activeId}`;
            QRCode.toDataURL(url, {
                width: 512,
                margin: 2,
                color: { dark: "#002FA7", light: "#FFFFFF" },
            }).then(setQrDataUrl).catch(console.error);
        }
    }, [activeId]);

    useEffect(() => {
        if (!isNew && paramId) {
            const fetchArtwork = async () => {
                const docRef = doc(db, "catalog", paramId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        status: data.status || "draft",
                        featured: data.featured || false,
                        gallery: data.gallery || [],
                        priceOnRequest: data.priceOnRequest || false,
                    } as any));
                } else {
                    showToast("Artwork not found", "error");
                }
                setFetching(false);
            };
            fetchArtwork();
        }
    }, [paramId, isNew, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const now = new Date().toISOString();
            const payload = { ...formData, status: "published", updatedAt: now };

            const currentId = docId || paramId;

            if (currentId && currentId !== "new") {
                await updateDoc(doc(db, "catalog", currentId), payload);
                showToast("Artwork published", "success");
            } else {
                await addDoc(collection(db, "catalog"), {
                    ...payload,
                    createdAt: now,
                });
                showToast("Artwork created & published", "success");
            }
            router.push("/admin/catalog");
        } catch (error) {
            console.error("Save failed:", error);
            showToast("Failed to publish artwork", "error");
        } finally {
            setLoading(false);
        }
    };

    const addGalleryImage = (url: string) => {
        if (url) setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index),
        }));
    };

    const downloadQr = () => {
        if (!qrDataUrl) return;
        const link = document.createElement("a");
        link.download = `qr-${formData.title || "artwork"}.png`;
        link.href = qrDataUrl;
        link.click();
    };

    if (fetching) return <div className="p-12 text-center text-gray-400">Loading editor...</div>;

    return (
        <form onSubmit={handleSubmit} className="relative">
            <PageHeader
                title={isNew ? "Add Artwork" : "Edit Artwork"}
                description={
                    <span className="flex items-center gap-2">
                        {isNew ? "Add a new piece to the catalog." : `Editing: ${formData.title}`}
                    </span>
                }
                backHref="/admin/catalog"
                sticky={true}
            />

            <EditorLayout
                sidebar={
                    <>
                        {/* QR Code Panel */}
                        <FormSection title="QR Code" variant="sidebar" icon={<QrCode size={14} />}>
                            {activeId && activeId !== "new" ? (
                                <div className="space-y-4">
                                    <div className="bg-[#F4F4F2] rounded-lg p-6 flex items-center justify-center">
                                        {qrDataUrl ? (
                                            <img src={qrDataUrl} alt="QR Code" className="w-full max-w-[180px] h-auto" />
                                        ) : (
                                            <div className="w-[180px] h-[180px] bg-gray-100 rounded animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-mono text-center break-all">
                                        {SITE_DOMAIN}/catalog/{activeId}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={downloadQr}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#002FA7] text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-[#001f7a] transition-colors"
                                        >
                                            <Download size={13} />
                                            Download
                                        </button>
                                        <a
                                            href={`${SITE_DOMAIN}/catalog/${activeId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 border border-[#002FA7]/20 text-[#002FA7] rounded-lg hover:bg-[#002FA7]/5 transition-colors"
                                            title="Preview page"
                                        >
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#F4F4F2] rounded-lg p-8 flex flex-col items-center justify-center text-center">
                                    <QrCode size={28} className="text-[#002FA7]/15 mb-3" />
                                    <p className="text-[11px] text-gray-400">QR code generates automatically once saved as draft.</p>
                                </div>
                            )}
                        </FormSection>

                        {/* Main Image */}
                        <FormSection title="Main Image" variant="sidebar" icon={<ImageIcon size={14} />}>
                            <ImageUpload
                                value={formData.mainImage}
                                onChange={url => setFormData({ ...formData, mainImage: url })}
                                folder="catalog"
                            />
                        </FormSection>

                        {/* Settings */}
                        <FormSection title="Settings" variant="sidebar">
                            <ToggleSwitch
                                id="priceOnRequest"
                                label="Price on Request"
                                description="Hide price, show 'Contact for pricing' instead"
                                checked={formData.priceOnRequest}
                                onChange={(checked) => setFormData({ ...formData, priceOnRequest: checked, price: checked ? "" : formData.price })}
                            />
                            <ToggleSwitch
                                id="featured"
                                label="Feature on Homepage"
                                description="Display this artwork prominently on the front page"
                                checked={formData.featured}
                                onChange={(checked) => setFormData({ ...formData, featured: checked })}
                            />
                        </FormSection>
                    </>
                }
            >
                {/* Artwork Details */}
                <FormSection title="Artwork Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Artwork Title" required>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className={inputStylesLg}
                                placeholder="e.g. Untitled No. 7"
                            />
                        </FormField>
                        <FormField label="Artist" required>
                            <input
                                type="text"
                                required
                                value={formData.artist}
                                onChange={e => setFormData({ ...formData, artist: e.target.value })}
                                className={inputStyles}
                                placeholder="e.g. Sofia Lora"
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <FormField label="Medium">
                            <input
                                type="text"
                                value={formData.medium}
                                onChange={e => setFormData({ ...formData, medium: e.target.value })}
                                className={inputStyles}
                                placeholder="Oil on Canvas"
                            />
                        </FormField>
                        <FormField label="Dimensions">
                            <input
                                type="text"
                                value={formData.dimensions}
                                onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                                className={inputStyles}
                                placeholder="120 × 80 cm"
                            />
                        </FormField>
                        <FormField label="Year">
                            <input
                                type="text"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                className={inputStyles}
                            />
                        </FormField>
                        <FormField label="Price">
                            <input
                                type="text"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className={`${inputStyles} ${formData.priceOnRequest ? "opacity-40 pointer-events-none" : ""}`}
                                placeholder="$5,000"
                                disabled={formData.priceOnRequest}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Description"
                        charCount={{ current: formData.description.length, max: 1000 }}
                    >
                        <textarea
                            rows={5}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className={textareaStyles}
                            placeholder="Describe the artwork, its inspiration, and context..."
                        />
                    </FormField>
                </FormSection>

                {/* Gallery */}
                <FormSection title="Gallery Images" description="Additional views and detail shots of the artwork">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {formData.gallery.map((url, i) => (
                            <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                                <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i + 1}`} />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(i)}
                                    className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                                >
                                    <X size={11} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                        <p className="text-[10px] text-gray-400 mb-2 text-center uppercase font-bold tracking-wider">Add to Gallery</p>
                        <ImageUpload value="" onChange={addGalleryImage} folder="catalog/gallery" />
                    </div>
                </FormSection>
            </EditorLayout>

            <FormActions
                loading={loading}
                onCancel={() => router.push("/admin/catalog")}
                onSaveDraft={triggerSave}
                saveStatus={saveStatus}
                isPublished={formData.status === "published"}
            />
        </form>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading editor...</div>}>
            <CatalogEditor />
        </Suspense>
    );
}
