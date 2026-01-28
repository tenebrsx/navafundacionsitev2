"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectPostDetail from "@/components/ProjectPostDetail";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    type: string;
    year: string;
    description: string;
    content?: string;
    imageUrl?: string;
    location?: string;
    images?: string[];
}

export default function ProjectPostClient({ id }: { id: string }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch ALL to find current (for consistency with other pages, or fetch doc directly)
                const q = query(collection(db, "projects"));
                const querySnapshot = await getDocs(q);
                const allProjects = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Project[];

                let foundProject = allProjects.find((p) => p.id === id);

                // Mock Fallback
                if (!foundProject && ["1", "2", "3", "4", "5", "6"].includes(id)) {
                    const mockProjects: Project[] = [
                        { id: "1", title: "Echoes of the Unseen", type: "Exhibition", year: "2025", description: "A curatorial exploration of silence and space.", location: "Santo Domingo", content: "The exhibition posits silence not as an absence, but as a structural material..." },
                        { id: "2", title: "Tropical Modernism Revisited", type: "Research", year: "2024", description: "Archiving the architectural heritage.", location: "Remote", content: "Through extensive field research, this project documents..." },
                        { id: "3", title: "Zona Maco: Nava Presentation", type: "Art Fair", year: "2024", description: "Solo presentation of Sofia Lora.", location: "Mexico City", content: "Sofia Lora's work challenges the boundaries of canvas..." },
                        // ... others simplified
                    ];
                    foundProject = mockProjects.find(p => p.id === id);
                }

                if (foundProject) {
                    setProject(foundProject);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return <div className="p-24 text-center font-mono text-[#002FA7] animate-pulse">Loading Project...</div>;
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[#002FA7] gap-4">
                <h1 className="text-4xl font-normal">Project Not Found</h1>
                <Link href="/projects" className="font-mono text-xs uppercase tracking-widest border border-[#002FA7] px-6 py-3 rounded-full hover:bg-[#002FA7] hover:text-white transition-colors">
                    Return to Index
                </Link>
            </div>
        );
    }

    return <ProjectPostDetail project={project} />;
}
