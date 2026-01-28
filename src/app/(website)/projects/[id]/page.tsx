import ProjectPostClient from "@/components/ProjectPostClient";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const paths = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));

        // Mock IDs fallback
        const mockIds = ["1", "2", "3", "4", "5", "6"].map(id => ({ id }));
        const uniqueIds = new Set([...paths.map(p => p.id), ...mockIds.map(p => p.id)]);

        return Array.from(uniqueIds).map(id => ({ id }));
    } catch (error) {
        console.error("Error generating static params for projects:", error);
        return [];
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProjectPostClient id={id} />;
}
