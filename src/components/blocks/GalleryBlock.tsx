export default function GalleryBlock({ data }: { data: any }) {
    const images = data.images || []; // Array of { url, caption }? VisualBlock array handling is primitive for now.
    // For simplicity, let's assume 'images' is just a comma-separated string of URLs or we accept up to 4 dedicated fields for now 
    // to match our current capabilities (image1, image2, etc) or use the 'VisualBlockList' style if we want dynamic array.
    // Let's assume schema has image1, image2, image3. 
    // OR BETTER: Let's assume the user edits this block to set a TITLE, 
    // and then uses a separate mechanism for images? No, keep it simple.
    // Let's stick to 3 images for this block type for v1.

    const items = [
        { src: data.image1, caption: data.caption1 },
        { src: data.image2, caption: data.caption2 },
        { src: data.image3, caption: data.caption3 },
    ].filter(i => i.src);

    return (
        <section className="w-full py-12">
            {data.title && <h3 className="text-xl font-bold uppercase text-white mb-8 border-l-4 border-nava-green pl-4">{data.title}</h3>}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                {items.map((img, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 relative group overflow-hidden">
                        <img src={img.src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                        {img.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {img.caption}
                            </div>
                        )}
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-3 text-center p-12 border border-dashed border-zinc-800 text-zinc-600 uppercase font-mono">
                        Add images in editor...
                    </div>
                )}
            </div>
        </section>
    );
}
