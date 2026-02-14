import EventPageClient from "@/components/EventPageClient";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Ensure static generation for this path

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const paths = querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
        // Fallback for build safety if no events exist yet
        return paths.length > 0 ? paths : [];
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EventPageClient id={id} />;
}
