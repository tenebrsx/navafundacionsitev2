"use client";

import { motion } from "framer-motion";
import { Children } from "react";

interface StaggeredGridProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: (staggerDelay: number) => ({
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
        },
    }),
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as any,
        }
    },
};

export default function StaggeredGrid({ children, className = "", staggerDelay = 0.05 }: StaggeredGridProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={staggerDelay}
            className={className}
        >
            {Children.map(children, (child) => (
                <motion.div variants={itemVariants}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}
