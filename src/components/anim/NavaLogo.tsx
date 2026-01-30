"use client";

import { motion } from "framer-motion";

interface NavaLogoProps {
    className?: string;
    color?: string;
}

export default function NavaLogo({ className = "w-full h-full", color = "currentColor" }: NavaLogoProps) {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* 
                The "N" constructed to support future morphing into A/V/A.
                It relies on a diagonal grid. 
                Shape:
                1. Left vertical (thick)
                2. Diagonal (thick)
                3. Right vertical (thick)
            */}

            <motion.path
                // A massive, blocky N. 
                // Matches the heavy typography of the site.
                d="M20 10 V90 H40 L70 40 V90 H90 V10 H70 L40 60 V10 H20Z"
                fill={color}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
            />
        </svg>
    );
}
