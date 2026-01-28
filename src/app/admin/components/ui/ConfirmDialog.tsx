"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmDialog({ isOpen, title, description, onConfirm, onCancel, loading }: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-red-100"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-none mb-2">{title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />}
                        {loading ? "Deleting..." : "Delete Permanently"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
