"use client";

import NavaLogo from "@/components/anim/NavaLogo";

export default function BrandShowcase() {
    return (
        <section className="py-24 border-t border-[#002FA7]">
            <div className="px-4 sm:px-12 md:px-24 mb-12">
                <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-4">Brand Identity</span>
                <h2 className="text-4xl md:text-5xl text-[#002FA7]">Visual Language</h2>
            </div>

            <div className="w-full bg-white flex flex-col md:flex-row border-y border-[#002FA7]">
                {/* Logo Container */}
                <div className="w-full md:w-1/2 p-12 md:p-24 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#002FA7]">
                    <div className="relative w-64 h-64 md:w-96 md:h-96">
                        <NavaLogo color="#002FA7" />
                    </div>
                </div>

                {/* Context/Description */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#002FA7] text-white flex flex-col justify-center">
                    <div className="max-w-md">
                        <h3 className="font-mono text-sm uppercase tracking-widest mb-6 opacity-80">The Symbol</h3>
                        <p className="text-lg md:text-xl font-serif leading-relaxed mb-8">
                            A digital construction of the letter 'N'. Built from pure geometric data, this programmable form lays the groundwork for future kinetic identities where the symbol can morph and reconfigure into the full NAVA wordmark.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono opacity-60 uppercase tracking-widest">
                            <div>
                                <span className="block mb-1 opacity-50">Color</span>
                                #002FA7 Ultramarine
                            </div>
                            <div>
                                <span className="block mb-1 opacity-50">Typeface</span>
                                Inter / IBM Plex
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
