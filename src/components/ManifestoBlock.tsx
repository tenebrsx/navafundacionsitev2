import Link from "next/link";

export default function ManifestoBlock() {
    return (
        <section className="pt-32 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-8">
                <h1 className="text-4xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter text-[#002FA7] max-w-4xl font-serif">
                    Nava is a living archive for the preservation of <span className="italic">Narrativa Alternativa</span> within the Caribbean context.
                </h1>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-8 border-t border-[#002FA7]/20 pt-8">
                    <p className="font-mono text-sm md:text-base text-[#002FA7] max-w-xl leading-relaxed">
                        Operating as an info-portal and research engine, we catalogue, exhibit, and publish works that challenge established historical canons. We are building the infrastructure for the next generation of thought.
                    </p>

                    <Link
                        href="/manifesto"
                        className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#002FA7] hover:bg-[#002FA7] hover:text-white px-4 py-2 border border-[#002FA7] transition-all"
                    >
                        Read Full Manifesto
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
