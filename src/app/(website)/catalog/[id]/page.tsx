import ArtworkDetail from "@/components/ArtworkDetail";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "catalog"));
        const paths = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));

        // Fallback IDs for static export (required when catalog collection is empty)
        const fallbackIds = ["1", "2", "3"].map(id => ({ id }));
        const uniqueIds = new Set([...paths.map(p => p.id), ...fallbackIds.map(p => p.id)]);

        return Array.from(uniqueIds).map(id => ({ id }));
    } catch (error) {
        console.error("Error generating static params for catalog:", error);
        return [{ id: "1" }];
    }
}

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ArtworkDetail id={id} />;
}
