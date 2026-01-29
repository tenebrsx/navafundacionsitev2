"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import StaggeredGrid from "@/components/anim/StaggeredGrid";
import ScrollRevealText from "@/components/anim/ScrollRevealText";
import { ArrowUpRight } from "lucide-react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    image?: string;
    status?: string;
    order?: number;
    type?: "Core" | "Advisory";
}

function TeamPageContent() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch published team members
                const q = query(
                    collection(db, "team"),
                    where("status", "==", "published"),
                    orderBy("order", "asc")
                );

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as TeamMember[];
                setTeam(data);
            } catch (error) {
                console.error("Error fetching team details:", error);

                // Fallback attempt without sort if index missing
                try {
                    const qFallback = query(collection(db, "team"), where("status", "==", "published"));
                    const snap = await getDocs(qFallback);
                    const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as TeamMember[];
                    setTeam(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
                } catch (e) {
                    console.error("Fallback failed", e);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Mock Data Fallback
    const mockTeam: TeamMember[] = [
        { id: "1", name: "Elena Rossi", role: "Founding Director", bio: "Former curator at Museo de Arte Moderno with a focus on Caribbean archipelagic thought.", image: "bg-[#D4D4D0]", type: "Core" },
        { id: "2", name: "David Mendez", role: "Architecture & Design", bio: "Specializing in tropical modernism and sustainable exhibition spaces.", image: "bg-[#E5E5E0]", type: "Core" },
        { id: "3", name: "Sarah Jean-Baptiste", role: "Head of Research", bio: "PhD candidate exploring digital diasporas and vernacular archives.", image: "bg-[#F0F0F0]", type: "Core" },
        { id: "4", name: "Luis Castillo", role: "Program Coordinator", bio: "Connecting local artist communities with international residency programs.", image: "bg-[#002FA7]/10", type: "Core" }
    ];

    const displayTeam = team.length > 0 ? team : mockTeam;
    const coreTeam = displayTeam.filter(m => !m.type || m.type === "Core");

    // Static Advisory for now unless in DB
    const advisoryBoard = ["Dr. Alanna Heiss", "Hans Ulrich Obrist", "Mariana Yampolsky"];

    return (
        <div className="w-full">
            <ScrollRevealText
                text="Team"
                className="text-[12vw] leading-[0.8] tracking-tighter text-[#002FA7] mix-blend-multiply mb-12 md:mb-24"
                el="h1"
            />

            <div className="flex flex-col gap-12 md:gap-24">

                {/* Introduction / Statement */}
                <div className="max-w-2xl text-lg md:text-2xl leading-relaxed text-[#002FA7] border-b border-[#002FA7] pb-12">
                    <p>
                        Our team constitutes a collective of curators, researchers, and architects dedicated to rewriting the narrative of Caribbean art from the inside out.
                    </p>
                </div>

                {loading && team.length === 0 ? (
                    <div className="py-24 text-center font-mono text-sm text-[#002FA7] animate-pulse">Loading Team...</div>
                ) : (
                    /* Team Grid */
                    <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16" staggerDelay={0.1}>
                        {coreTeam.map((member, i) => (
                            <Link href={`/team/${member.id}`} key={member.id} className="group flex flex-col gap-6 cursor-pointer block">
                                {/* Image Placeholder */}
                                <div className={`w-full aspect-[3/4] md:aspect-[4/5] ${member.image ? '' : 'bg-zinc-100'} relative overflow-hidden border border-[#002FA7]/10`}>
                                    {member.image && <img src={member.image} alt={member.name} className="w-full h-full object-cover" />}
                                    <div className="absolute inset-0 bg-[#002FA7]/0 group-hover:bg-[#002FA7]/10 transition-colors duration-500"></div>
                                    {/* Initial of First Name as placeholder graphic if no image */}
                                    {!member.image && (
                                        <div className="absolute bottom-4 left-4 text-[10vw] md:text-[8vw] text-[#002FA7] leading-none opacity-10 group-hover:opacity-20 transition-opacity">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-baseline border-b border-[#002FA7]/20 pb-2">
                                        <span className="font-mono text-xs uppercase tracking-widest opacity-60">{member.role}</span>
                                        <ArrowUpRight size={16} className="text-[#002FA7] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h2 className="text-3xl text-[#002FA7]">{member.name}</h2>
                                    <p className="text-sm leading-relaxed opacity-80 max-w-sm mt-2">
                                        {member.bio}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </StaggeredGrid>
                )}

                {/* Advisory Board List (Simple) */}
                <div className="flex flex-col gap-8 pt-12">
                    <h3 className="font-mono text-xs uppercase tracking-widest opacity-60">Advisory Board</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#002FA7] pt-8">
                        {advisoryBoard.map((name, i) => (
                            <div key={i} className="text-xl text-[#002FA7]">{name}</div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function TeamPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TeamPageContent />
        </Suspense>
    );
}
