// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NavMorphLogo() {
    const [mode, setMode] = useState<"logo" | "spinner">("logo");

    useEffect(() => {
        const cycle = () => {
            // Stay as logo for 4s
            setTimeout(() => {
                setMode("spinner");
                // Stay as spinner for 4s (exactly 2 rotations)
                setTimeout(() => {
                    setMode("logo");
                    // Loop
                    cycle();
                }, 4000);
            }, 4000);
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
    const pathVariants = {
        // N: Origin ~65 -> Target Center 200. Delta: 135
        n: {
            logo: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            spinner: { x: 135, y: 0, scale: 0.8, rotate: 90, opacity: 1 }
        },
        // A1: Origin ~155 -> Target Center 200. Delta: 45
        a1: {
            logo: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            spinner: { x: 45, y: 0, scale: 0.8, rotate: 180, opacity: 1 }
        },
        // V: Origin ~245 -> Target Center 200. Delta: -45
        v: {
            logo: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            spinner: { x: -45, y: 0, scale: 0.8, rotate: 270, opacity: 1 }
        },
        // A2: Origin ~335 -> Target Center 200. Delta: -135
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
        <div className="relative z-20 w-full max-w-full flex justify-center pointer-events-none">
            {/* @ts-ignore */}
            <motion.div
                animate={mode}
                variants={containerVariants}
                className="w-full max-w-lg origin-center"
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
}
