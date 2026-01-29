import EventPageClient from "@/components/EventPageClient";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Ensure static generation for this path
export const dynamicParams = true; // Allow fallback for dev mode updates

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
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
