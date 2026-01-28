"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader } from "../components/AdminShared";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";

export default function BlogPostsList() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "posts"), orderBy("date", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await deleteDoc(doc(db, "posts", id));
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Failed to delete post");
            console.error(error);
        }
    };

    return (
        <div>
            <PageHeader
                title="Journal / Blog"
                description="Manage news and articles."
                actionLabel="Create Post"
                actionHref="/admin/posts/new"
            />

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading posts...</div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 font-bold text-xs uppercase text-gray-500">Title</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-500">Date</th>
                                <th className="p-4 font-bold text-xs uppercase text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-900">{post.title}</td>
                                    <td className="p-4 text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <Link
                                            href={`/admin/posts/${post.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-400 italic">No posts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
