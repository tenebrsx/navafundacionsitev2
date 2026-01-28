// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Components ---

const RenderGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply">
        {/* Pulsing Grid Lines */}
        <div className="absolute inset-0 flex justify-between px-4 sm:px-12 md:px-24">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={`v-${i}`}
                    initial={{ height: "0%", opacity: 0 }}
                    animate={{ height: "100%", opacity: [0.1, 0.3, 0.1] }}
                    transition={{
                        height: { duration: 1.5, delay: i * 0.1, ease: "circOut" },
                        opacity: { duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }
                    }}
                    className="w-[1px] bg-[#002FA7]/30"
                />
            ))}
        </div>
        <div className="absolute inset-0 flex flex-col justify-between py-12">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={`h-${i}`}
                    initial={{ width: "0%", opacity: 0 }}
                    animate={{ width: "100%", opacity: [0.1, 0.3, 0.1] }}
                    transition={{
                        width: { duration: 1.5, delay: i * 0.1 + 0.5, ease: "circOut" },
                        opacity: { duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 + 1 }
                    }}
                    className="h-[1px] bg-[#002FA7]/30"
                />
            ))}
        </div>
    </div>
);

const NavMorphLogo = () => {
    const [mode, setMode] = useState<"logo" | "spinner">("logo");

    useEffect(() => {
        const cycle = () => {
            // Stay as logo for 3s
            setTimeout(() => {
                setMode("spinner");
                // Stay as spinner for 4s (exactly 2 rotations)
                setTimeout(() => {
                    setMode("logo");
                    // Loop
                    cycle();
                }, 4000);
            }, 3000);
        };
        // Initial delay before starting cycle
        const timer = setTimeout(cycle, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Container rotates when in spinner mode
    const containerVariants: any = {
        logo: { rotate: 0 },
        spinner: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: [0, 0, 1, 1]
            }
        }
    };

    // Letter Transforms
    // 400x120 viewBox
    // Center is approx 200, 60

    const pathVariants = {
        // N: Origin ~65 (was 50) -> Target Center 200. Delta: 135
        n: {
            logo: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            spinner: { x: 135, y: 0, scale: 0.8, rotate: 90, opacity: 1 }
        },
        // A1: Origin ~155 (was 140) -> Target Center 200. Delta: 45
        a1: {
            logo: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            spinner: { x: 45, y: 0, scale: 0.8, rotate: 180, opacity: 1 }
        },
        // V: Origin ~245 (was 230) -> Target Center 200. Delta: -45
        v: {
            logo: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            spinner: { x: -45, y: 0, scale: 0.8, rotate: 270, opacity: 1 }
        },
        // A2: Origin ~335 (was 320) -> Target Center 200. Delta: -135
        a2: {
            logo: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            spinner: { x: -135, y: 0, scale: 0.8, rotate: 0, opacity: 1 }
        }
    };

    const commonTransition: any = {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1] // smooth cubic-bezier
    };

    return (
        <div className="relative z-20 w-full max-w-6xl mx-auto mix-blend-multiply flex justify-center">
            {/* @ts-ignore */}
            <motion.div
                animate={mode}
                variants={containerVariants}
                className="w-full max-w-2xl origin-center"
            >
                <svg
                    viewBox="0 0 400 120"
                    className="w-full h-auto"
                    style={{ overflow: "visible" }}
                >
                    {/* N */}
                    <motion.path
                        d="M 35 100 V 20 L 95 100 V 20"
                        fill="transparent"
                        stroke="#002FA7"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={pathVariants.n}
                        transition={commonTransition}
                    />
                    {/* A */}
                    <motion.path
                        d="M 125 100 L 155 20 L 185 100 M 135 75 H 175"
                        fill="transparent"
                        stroke="#002FA7"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={pathVariants.a1}
                        transition={commonTransition}
                    />
                    {/* V */}
                    <motion.path
                        d="M 215 20 L 245 100 L 275 20"
                        fill="transparent"
                        stroke="#002FA7"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={pathVariants.v}
                        transition={commonTransition}
                    />
                    {/* A */}
                    <motion.path
                        d="M 305 100 L 335 20 L 365 100 M 315 75 H 355"
                        fill="transparent"
                        stroke="#002FA7"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={pathVariants.a2}
                        transition={commonTransition}
                    />
                </svg>
            </motion.div>
        </div>
    );
};

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

            <RenderGrid />

            {/* Center Content - Logo + Form */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8 md:gap-12">
                <NavMorphLogo />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#002FA7] uppercase font-bold"
                >
                    Narrativa Alternativa
                </motion.div>

                {/* Email Form */}
                <div className="w-full max-w-md flex flex-col items-center gap-4 mt-8">
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
                            <div className="flex w-full border-b-2 border-[#002FA7] relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-transparent w-full h-12 px-2 outline-none text-[#002FA7] placeholder:text-[#002FA7]/40 font-mono text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
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
