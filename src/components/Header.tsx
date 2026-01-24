"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "./Navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white p-4 md:p-6 flex justify-between items-center bg-transparent pointer-events-none">

        {/* Logo Area */}
        <Link href="/" className="pointer-events-auto block group">
          <div className="flex flex-col leading-[0.85] font-bold text-2xl md:text-4xl uppercase tracking-tighter">
            <span>Nava</span>
            <span>Fundacion</span>
          </div>
        </Link>

        {/* Actions Area */}
        <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="font-mono text-sm font-bold uppercase hover:text-nava-green transition-colors"
          >
            {language === "en" ? "EN" : "ES"}
          </button>

          {/* Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:text-nava-green transition-colors duration-300"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isOpen && <Navigation onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
