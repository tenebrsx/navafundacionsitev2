import Link from "next/link";
import NavaLogoRef from "@/components/anim/NavaLogoRef";

const footerLinks = [
    { label: "Journal", href: "/blog" },
    { label: "Events", href: "/events" },
    { label: "Projects", href: "/projects" },
    { label: "Catalog", href: "/catalog" },
    { label: "Team", href: "/team" },
    { label: "About", href: "/about" },
];

export default function Footer() {
    return (
        <footer className="bg-white text-[#002FA7] border-t border-[#002FA7] px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-full mx-auto flex flex-col gap-6">
                <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight">Contacts</h3>
                <div className="w-full h-px bg-[#002FA7]/20" />
                <a href="mailto:info@nava-fundacion.org" className="hover:underline text-lg mt-2 block">
                    info@nava-fundacion.org
                </a>

                <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm uppercase font-medium">
                    {footerLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:underline">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex gap-4 mt-6 text-sm uppercase font-medium">
                    <Link
                        href="https://www.instagram.com/nava_fundacion/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        Instagram
                    </Link>
                </div>

                <div className="flex items-center gap-3 mt-4 opacity-50 text-xs">
                    <div className="w-8 h-8 overflow-hidden relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.06] origin-center">
                            <NavaLogoRef />
                        </div>
                    </div>
                    <p>© 2026 Nava Fundacion</p>
                </div>
            </div>
        </footer>
    );
}
