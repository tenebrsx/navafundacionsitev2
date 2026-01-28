"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import FullScreenMenu from "./FullScreenMenu";
import MagneticButton from "@/components/anim/MagneticButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Corner Anchor: Top Left (Logo) */}
      <div className="fixed top-0 left-0 z-50 p-4 md:p-6 mix-blend-multiply text-[#002FA7]">
        <MagneticButton>
          <Link href="/" className="group flex flex-col items-start gap-1">
            <span className="text-xl md:text-2xl font-bold uppercase tracking-tighter leading-none">
              Nava
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Home
            </span>
          </Link>
        </MagneticButton>
      </div>

      {/* Corner Anchor: Top Right (Menu) */}
      <div className="fixed top-0 right-0 z-50 p-4 md:p-6 text-[#002FA7]">
        <MagneticButton>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 uppercase font-medium text-sm tracking-widest group"
          >
            <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">Menu</span>
            <div className="bg-[#002FA7] text-white p-2 md:p-3 rounded-full group-hover:scale-110 transition-transform">
              <MenuIcon size={20} />
            </div>
          </button>
        </MagneticButton>
      </div>

      <AnimatePresence>
        {isOpen && <FullScreenMenu onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
