import EventPageClient from "@/components/EventPageClient";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Ensure static generation for this path
export const dynamicParams = false; // Must be false for output: 'export'
// but with output: export, we kinda imply dynamicParams=false effectively for the build? 
// No, Next.js 'export' simply requires generateStaticParams to return ALL paths.

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "movements"));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EventPageClient id={id} />;
}
