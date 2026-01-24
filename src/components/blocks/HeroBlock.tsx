export default function HeroBlock({ data }: { data: any }) {
    return (
        <section className="relative w-full aspect-[21/9] bg-zinc-900 border border-zinc-800 overflow-hidden group">
            {data.image ? (
                <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold uppercase tracking-widest">
                    Hero Image
                </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                {data.category && (
                    <span className="bg-nava-green text-black px-2 py-1 text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                        {data.category}
                    </span>
                )}
                {data.title && (
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2 leading-none drop-shadow-lg">
                        {data.title}
                    </h2>
                )}
                {data.subtitle && (
                    <p className="text-lg md:text-2xl font-mono text-zinc-300 max-w-2xl drop-shadow-md">
                        {data.subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
