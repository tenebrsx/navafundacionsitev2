"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TeamMemberDetail from "@/components/TeamMemberDetail";
import Link from "next/link";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    longBio?: string;
    email?: string;
    image?: string;
    imageUrl?: string;
}

export default function TeamMemberClient({ id }: { id: string }) {
    const [member, setMember] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch ALL to find current (consistent with usage so far)
                const q = query(collection(db, "team"));
                const querySnapshot = await getDocs(q);
                const allMembers = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as TeamMember[];

                let foundMember = allMembers.find((m) => m.id === id);

                // Mock Fallback
                if (!foundMember && ["1", "2", "3", "4"].includes(id)) {
                    const mockTeam: TeamMember[] = [
                        { id: "1", name: "Elena Rossi", role: "Founding Director", bio: "Former curator at Museo de Arte Moderno...", email: "elena@nava.org", longBio: "Elena Rossi has spent over a decade curating exhibitions..." },
                        { id: "2", name: "David Mendez", role: "Architecture & Design", bio: "Specializing in tropical modernism...", email: "david@nava.org" },
                        { id: "3", name: "Sarah Jean-Baptiste", role: "Head of Research", bio: "PhD candidate exploring digital diasporas...", email: "sarah@nava.org" },
                        { id: "4", name: "Luis Castillo", role: "Program Coordinator", bio: "Connecting local artist communities...", email: "luis@nava.org" }
                    ];
                    foundMember = mockTeam.find(m => m.id === id);
                }

                if (foundMember) {
                    setMember(foundMember);
                }
            } catch (error) {
                console.error("Error fetching member:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id]);

    if (loading) {
        return <div className="p-24 text-center font-mono text-[#002FA7] animate-pulse">Loading Profile...</div>;
    }

    if (!member) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[#002FA7] gap-4">
                <h1 className="text-4xl font-normal">Member Not Found</h1>
                <Link href="/team" className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-6 py-3 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors">
                    Return to Team
                </Link>
            </div>
        );
    }

    return <TeamMemberDetail member={member} />;
}
