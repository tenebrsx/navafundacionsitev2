"use client";

import Link from "next/link";

export default function VisitPage() {
    return (
        <div className="min-h-screen bg-white text-[#002FA7] pt-32 pb-24 px-4 md:px-6 font-sans">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">

                {/* Left: Info */}
                <div>
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] -ml-1 mb-16">
                        Visit
                    </h1>

                    <div className="flex flex-col gap-12 text-lg">
                        <div>
                            <h3 className="text-sm opacity-50 uppercase tracking-widest mb-2">Location</h3>
                            <p className="font-medium">
                                C. Arzobispo Meriño 2<br />
                                Zona Colonial<br />
                                Santo Domingo, Dominican Republic
                            </p>
                            <Link href="https://maps.google.com" target="_blank" className="text-sm underline mt-2 inline-block">View on Map ↗</Link>
                        </div>

                        <div>
                            <h3 className="text-sm opacity-50 uppercase tracking-widest mb-2">Hours</h3>
                            <div className="grid grid-cols-2 gap-8 max-w-sm">
                                <div>
                                    <p>Wed — Fri</p>
                                    <p>Sat — Sun</p>
                                    <p className="opacity-50 mt-2">Mon — Tue</p>
                                </div>
                                <div className="text-right">
                                    <p>11am — 6pm</p>
                                    <p>12pm — 5pm</p>
                                    <p className="opacity-50 mt-2">Closed</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm opacity-50 uppercase tracking-widest mb-2">Contact</h3>
                            <a href="mailto:info@nava.org" className="block text-2xl font-bold hover:opacity-50 transition-opacity">info@nava.org</a>
                            <p className="mt-2 text-sm">+1 (809) 555-0123</p>
                        </div>
                    </div>
                </div>

                {/* Right: Map/Image Placeholder */}
                <div className="h-[60vh] md:h-auto bg-[#002FA7]/5 w-full relative">
                    {/* Placeholder for Map or Facade Image */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 text-4xl font-bold uppercase rotate-45">
                        Map / Image
                    </div>
                </div>

            </div>
        </div>
    );
}
