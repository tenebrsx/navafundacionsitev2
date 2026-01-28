import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white text-[#002FA7] border-t border-[#002FA7] px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">

                {/* About Section */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight">About Nava</h3>
                    <div className="w-full h-px bg-[#002FA7]/20 relative overflow-hidden">
                        {/* Decorative squiggle or line */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/squiggle.svg')] bg-repeat-x opacity-20"></div>
                    </div>
                    <p className="text-lg leading-relaxed max-w-md">
                        Nava Fundacion is a platform for alternative narratives in the Dominican Republic.
                    </p>
                </div>

                {/* Contacts Section */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight">Contacts</h3>
                    <div className="w-full h-px bg-[#002FA7]/20"></div>
                    <div className="flex flex-col gap-1 text-lg">
                        <p>Santo Domingo, DR</p>
                        <p>C. Arzobispo Meriño 2</p>
                        <a href="mailto:info@nava.org" className="hover:underline mt-4 block">info@nava.org</a>
                    </div>

                    <div className="flex gap-4 mt-8 text-sm uppercase font-medium">
                        <Link href="#" className="hover:underline">Instagram</Link>
                        <Link href="#" className="hover:underline">Twitter</Link>
                        <Link href="#" className="hover:underline">Are.na</Link>
                    </div>

                    <div className="mt-8 opacity-50 text-xs">
                        <p>© 2026 Nava Fundacion</p>
                    </div>
                </div>

            </div>
        </footer>
    );
}
