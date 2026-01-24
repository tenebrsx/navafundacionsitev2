"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/admin/AdminGuard";

interface Movement {
    id: string;
    title: string;
    date: string;
}

export default function AdminMovements() {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "movements"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Movement[];
            setMovements(data);
        } catch (error) {
            console.error("Error fetching movements:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this movement?")) {
            try {
                await deleteDoc(doc(db, "movements", id));
                fetchMovements(); // Refresh list
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };

    return (
        <AdminGuard>
            <div className="p-8 max-w-6xl mx-auto text-white">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <Link href="/admin" className="text-zinc-500 hover:text-white mb-2 text-sm">← Back to Dashboard</Link>
                        <h1 className="text-4xl font-bold uppercase text-nava-green">Manage Movements</h1>
                    </div>
                    <Link
                        href="/admin/events/edit?id=new"
                        className="bg-nava-green text-black px-6 py-3 font-bold uppercase hover:bg-white transition-colors"
                    >
                        Create New
                    </Link>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="border border-zinc-800 bg-zinc-900/50">
                        {movements.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500">No movements found. Create one!</div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {movements.map((movement) => (
                                    <div key={movement.id} className="p-6 flex justify-between items-center hover:bg-zinc-900 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-lg">{movement.title}</h3>
                                            <p className="text-sm text-zinc-500 font-mono">{movement.date}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <Link
                                                href={`/admin/events/edit?id=${movement.id}`}
                                                className="text-zinc-300 hover:text-nava-green uppercase text-sm font-bold"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(movement.id)}
                                                className="text-zinc-500 hover:text-red-500 uppercase text-sm font-bold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminGuard>
    );
}
