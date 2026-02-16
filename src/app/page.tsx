// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Components ---

import NavaLogoRef from "@/components/anim/NavaLogoRef";

export default function BuildingPage() {
    const [email, setEmail] = useState("");
    const [notified, setNotified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleNotify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await addDoc(collection(db, "subscribers"), {
                email: email,
                timestamp: new Date()
            });
            setNotified(true);
        } catch (err) {
            console.error("Error adding subscriber:", err);
            setError("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-white text-[#002FA7] font-sans selection:bg-[#002FA7] selection:text-white overflow-hidden flex flex-col justify-between">

            {/* Center Content - Logo + Form */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4 md:gap-6">
                <NavaLogoRef />

                {/* Email Form */}
                <div className="w-full max-w-md flex flex-col items-center gap-4">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="font-mono text-xs md:text-sm text-[#002FA7] text-center uppercase tracking-widest"
                    >
                        Be notified upon launch
                    </motion.p>
                    {notified ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-12 flex items-center gap-2 px-6 bg-[#002FA7] text-white font-mono text-xs uppercase tracking-wider"
                        >
                            You will be notified
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5 }}
                            onSubmit={handleNotify}
                            className="flex w-full flex-col gap-2 relative"
                        >
                            <div className="flex w-full border-b-2 border-[#002FA7] relative" suppressHydrationWarning>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-transparent w-full h-12 px-2 outline-none text-[#002FA7] placeholder:text-[#002FA7]/40 font-mono text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    suppressHydrationWarning
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="h-12 px-6 text-[#002FA7] hover:bg-[#002FA7] hover:text-white uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-50"
                                >
                                    {loading ? "..." : "Submit"}
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest absolute -bottom-6 left-0">
                                    {error}
                                </p>
                            )}
                        </motion.form>
                    )}
                </div>
            </main>

        </div>
    );
}
