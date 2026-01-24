import InlineText from "../admin/visual/InlineText";

export default function SplitContentBlock({ data }: { data: any }) {
    // Layout: 'image-left' or 'image-right'
    const isReversed = data.layout === "image-right";

    return (
        <section className="w-full py-12 border-t border-b border-zinc-900">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center`}>
                {/* Image Side */}
                <div className={`aspect-[4/5] bg-zinc-900 border border-zinc-800 relative overflow-hidden ${isReversed ? "md:order-2" : "md:order-1"}`}>
                    {data.image ? (
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold uppercase">
                            Image
                        </div>
                    )}
                </div>

                {/* Content Side */}
                <div className={`flex flex-col gap-6 ${isReversed ? "md:order-1" : "md:order-2"}`}>
                    <span className="text-nava-green font-mono text-sm uppercase tracking-widest min-h-[1.5em] block">
                        <InlineText field="caption" placeholder="Caption" />
                    </span>

                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white min-h-[1em] block">
                        <InlineText field="title" as="span" placeholder="Title" />
                    </h2>

                    <div className="text-zinc-400 leading-relaxed font-mono text-sm md:text-base whitespace-pre-wrap min-h-[3em] block">
                        <InlineText field="body" as="span" placeholder="Body content..." />
                    </div>
                </div>
            </div>
        </section>
    );
}
