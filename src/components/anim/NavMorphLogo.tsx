// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NavMorphLogo() {
    const [phase, setPhase] = useState<"collapsed" | "straight" | "rotated">("collapsed");

    useEffect(() => {
        let step = 0;
        const cycle = () => {
            step++;
            // Cycle: Collapsed -> Straight -> Collapsed -> Rotated -> Loop
            const sequence = ["collapsed", "straight", "collapsed", "rotated"];
            const nextState = sequence[step % sequence.length] as any;
            setPhase(nextState);
        };
        // Shorter hold time for a snappier feel
        const interval = setInterval(cycle, 3000); // Change state every 3s
        return () => clearInterval(interval);
    }, []);

    // Color
    const color = "#002FA7";

    // Path Definitions (Architectural / Geometric Style)
    // All letters defined in a 100x100 box logic for consistency
    // Then translated to positions

    // Refined Paths - Cleaner, 'Swiss' Geometric Sans
    // N: 20-90 x 10-90
    const pathN = "M20 10 V90 H44 L70 50 V90 H90 V10 H66 L40 50 V10 H20Z";
    // A: Wider, solid footing
    const pathA = "M20 90 L55 10 L90 90 H68 L61 70 H49 L42 90 H20 Z M55 35 L58 55 H52 Z";
    // V: Matching A
    const pathV = "M20 10 L55 90 L90 10 H68 L55 50 L42 10 H20 Z";

    // Smoother "Spring" physics for a premium feel
    const transition = {
        type: "spring",
        stiffness: 70,
        damping: 18,
        mass: 1
    };

    const variants = {
        n: {
            collapsed: { x: 145, opacity: 1 },
            straight: { x: 0, opacity: 1 },
            rotated: { x: 0, opacity: 1 }
        },
        a1: {
            collapsed: { x: 145, opacity: 0, scale: 0.9, rotate: 0 },
            straight: { x: 95, opacity: 1, scale: 1, rotate: 0 },
            rotated: { x: 90, opacity: 1, scale: 1, rotate: -90 } // < pointing Left
        },
        v: {
            collapsed: { x: 145, opacity: 0, scale: 0.9 },
            straight: { x: 195, opacity: 1, scale: 1 },
            rotated: { x: 195, opacity: 1, scale: 1 }
        },
        a2: {
            collapsed: { x: 145, opacity: 0, scale: 0.9, rotate: 0 },
            straight: { x: 290, opacity: 1, scale: 1, rotate: 0 },
            rotated: { x: 300, opacity: 1, scale: 1, rotate: 90 } // > pointing Right
        }
    };

    return (
        <div className="relative z-20 w-full flex justify-center h-[20vh] items-center pointer-events-none">
            <motion.svg
                viewBox="0 0 380 100"
                className="h-full w-auto max-w-full"
                animate={phase}
                initial="collapsed"
            >
                {/* Letter N */}
                <motion.path
                    d={pathN}
                    fill={color}
                    variants={variants.n}
                    transition={transition}
                />

                {/* Letter A (First) */}
                <motion.path
                    d={pathA}
                    fill={color}
                    variants={variants.a1}
                    transition={{ ...transition, delay: phase !== "collapsed" ? 0.1 : 0 }}
                />

                {/* Letter V */}
                <motion.path
                    d={pathV}
                    fill={color}
                    variants={variants.v}
                    transition={{ ...transition, delay: phase !== "collapsed" ? 0.2 : 0 }}
                />

                {/* Letter A (Last) */}
                <motion.path
                    d={pathA}
                    fill={color}
                    variants={variants.a2}
                    transition={{ ...transition, delay: phase !== "collapsed" ? 0.3 : 0 }}
                />
            </motion.svg>
        </div>
    );
}
