"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function InfoPage() {
    const [content, setContent] = useState({
        headerText: "Get\nInvolved",
        bodyText: "To participate in Nava 2026, or to propose a movement, please contact us directly.",
        mailingListTitle: "Mailing List",
        mailingListSubtitle: "Subscribe for updates on our movements.",
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, "content", "info");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setContent({
                        headerText: data.headerText || "Get\nInvolved",
                        bodyText: data.bodyText || "To participate in Nava 2026...",
                        mailingListTitle: data.mailingListTitle || "Mailing List",
                        mailingListSubtitle: data.mailingListSubtitle || "Subscribe for updates...",
                    });
                }
            } catch (error) {
                console.error("Error fetching info content:", error);
            }
        };

        fetchContent();
    }, []);

    // Helper to render newlines in header
    const renderHeader = (text: string) => {
        return text.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                {i < text.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-12">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                {renderHeader(content.headerText)}
            </h1>

            <div className="flex flex-col gap-8 font-mono text-sm">
                <p className="uppercase whitespace-pre-wrap">
                    {content.bodyText}
                </p>

                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="uppercase text-xs font-bold">Subject</label>
                        <select className="bg-transparent border-b border-white py-2 rounded-none outline-none text-white">
                            <option>General Inquiry</option>
                            <option>Press</option>
                            <option>Artist Submission</option>
                            <option>Sponsorship</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="uppercase text-xs font-bold">Message</label>
                        <textarea
                            rows={5}
                            className="bg-zinc-900 border border-transparent p-2 focus:border-white focus:bg-black transition-colors outline-none resize-none text-white"
                            placeholder="YOUR MESSAGE HERE..."
                        />
                    </div>

                    <button className="bg-white text-black py-3 uppercase font-bold hover:bg-black hover:text-white border border-transparent hover:border-white transition-colors">
                        Send Message
                    </button>
                </form>

                <div className="border-t border-white pt-8 mt-8">
                    <h2 className="font-bold text-lg uppercase mb-4">{content.mailingListTitle}</h2>
                    <p className="mb-4 text-xs text-zinc-500">{content.mailingListSubtitle}</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="border-b border-white w-full py-2 bg-transparent outline-none focus:border-nava-green transition-colors text-white"
                        />
                        <button className="uppercase font-bold hover:text-nava-green transition-colors">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
