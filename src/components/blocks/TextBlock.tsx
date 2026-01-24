export default function TextBlock({ data }: { data: any }) {
    // Determine alignment class
    const alignClass = data.alignment === "center" ? "text-center mx-auto" :
        data.alignment === "right" ? "text-right ml-auto" :
            "text-left mr-auto"; // default left

    // Determine max width class
    const widthClass = data.width === "narrow" ? "max-w-2xl" :
        data.width === "full" ? "max-w-none" :
            "max-w-4xl"; // default medium

    return (
        <section className={`w-full py-12 px-4 md:px-0`}>
            <div className={`${alignClass} ${widthClass}`}>
                {data.title && (
                    <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-6 border-b border-zinc-800 pb-2 inline-block">
                        {data.title}
                    </h3>
                )}
                {data.content && (
                    <div className="prose prose-invert prose-lg text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {data.content}
                    </div>
                )}
            </div>
        </section>
    );
}
