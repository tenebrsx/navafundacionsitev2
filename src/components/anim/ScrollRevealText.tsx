"use client";

import { motion } from "framer-motion";
import React from "react";

interface ScrollRevealTextProps {
    text: string;
    className?: string; // Text styles
    el?: keyof React.JSX.IntrinsicElements; // 'h1', 'h2', 'p', etc.
}

export default function ScrollRevealText({ text, className = "", el: Wrapper = "h2" }: ScrollRevealTextProps) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    // Cast Wrapper to any to avoid complex TS issues with motion properties on dynamic tags
    const MotionWrapper = motion[Wrapper as keyof typeof motion] as any;

    return (
        <MotionWrapper
            className={`overflow-hidden flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
        >
            {words.map((word, index) => (
                <motion.span variants={child} key={index} className="mr-[0.25em]">
                    {word}
                </motion.span>
            ))}
        </MotionWrapper>
    );
}
