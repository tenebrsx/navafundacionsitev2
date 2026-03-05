import Link from "next/link";
import NavaLogoRef from "@/components/anim/NavaLogoRef";

export default function Footer() {
    return (
        <footer className="bg-white text-[#002FA7] border-t border-[#002FA7] px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-full mx-auto flex flex-col gap-8">

                {/* Contacts Section */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight">Contacts</h3>
                    <div className="w-full h-px bg-[#002FA7]/20"></div>
                    <div className="flex flex-col gap-1 text-lg">
                        <a href="mailto:info@nava-fundacion.org" className="hover:underline mt-4 block">info@nava-fundacion.org</a>
                    </div>

                    <div className="flex gap-4 mt-8 text-sm uppercase font-medium">
                        <Link href="https://www.instagram.com/nava_fundacion/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="flex items-center gap-4 mt-4 opacity-50 text-xs">
                    <div className="relative w-8 h-8">
                        <NavaLogoRef />
                    </div>
                    <p>© 2026 Nava Fundacion</p>
                </div>

            </div>
        </footer>
    );
}
