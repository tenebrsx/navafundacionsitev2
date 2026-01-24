"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import VisualBlock from "@/components/admin/visual/VisualBlock";
import VisualBlockList from "@/components/admin/visual/VisualBlockList";

interface TeamPageContent {
    title: string;
    description: string;
}

const defaultContent: TeamPageContent = {
    title: "Our Team",
    description: "The team behind Nava Fundacion is composed of curators, artists, and cultural managers dedicated to the Caribbean."
};

export default function TeamPage() {
    const [content, setContent] = useState<TeamPageContent>(defaultContent);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, "content", "team");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setContent({
                        title: data.title || defaultContent.title,
                        description: data.description || defaultContent.description
                    });
                    setTeamMembers(data.members || []);
                }
            } catch (error) {
                console.error("Error fetching team content:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) return <div className="text-white p-8">Loading Team...</div>;

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-12 pt-12 md:pt-24 pb-24 px-4 md:px-0">

            {/* Header */}
            <VisualBlock
                id="team"
                path="content"
                data={content}
                schema={{
                    title: { type: "text", label: "Page Title" },
                    description: { type: "textarea", label: "Description" }
                }}
                render={(data: any) => (
                    <section className="border-b border-zinc-800 pb-8">
                        <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                            <span className="bg-nava-green px-2 text-black">{data.title}</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-mono max-w-2xl text-zinc-400">
                            {data.description}
                        </p>
                    </section>
                )}
            />

            {/* Team Grid */}
            <VisualBlockList
                id="team"
                path="content"
                fieldPath="members"
                items={teamMembers}
                itemSchema={{
                    name: { type: "text", label: "Name" },
                    role: { type: "text", label: "Role" },
                    bio: { type: "textarea", label: "Bio" },
                    image: { type: "image", label: "Photo URL" }
                }}
                defaultItemData={{
                    name: "New Member",
                    role: "Role",
                    bio: "Bio...",
                    image: ""
                }}
                direction="grid"
                renderItem={(member, i) => (
                    <div className="flex flex-col gap-4 group">
                        <div className="aspect-[3/4] bg-zinc-900 w-full overflow-hidden border border-zinc-800 relative">
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700 uppercase font-bold">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold uppercase">{member.name}</h3>
                            <p className="text-nava-green font-mono text-xs uppercase mb-2">{member.role}</p>
                            <p className="text-sm text-zinc-400 leading-relaxed">{member.bio}</p>
                        </div>
                    </div>
                )}
            />
            {(!teamMembers || teamMembers.length === 0) && (
                <div className="text-zinc-600 font-mono text-sm py-12 text-center bg-zinc-900/50 border border-zinc-800 border-dashed">
                    No team members listed yet.
                </div>
            )}

        </div>
    );
}
