"use client";

import { motion } from "framer-motion";

export default function PulsingGrid() {
    return (
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
}
