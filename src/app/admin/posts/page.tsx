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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between h-40">

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 p-1 rounded-lg">
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
                            </div>

                            <div className="pr-12">
                                <p className="text-xs text-gray-400 font-mono mb-2 uppercase tracking-widest">{new Date(post.date).toLocaleDateString()}</p>
                                <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">{post.title}</h3>
                            </div>

                            <div className="pt-4 mt-auto border-t border-gray-50">
                                <span className="text-xs text-blue-600 font-medium">Read Post &rarr;</span>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="col-span-full p-12 text-center text-gray-400 italic border-2 border-dashed border-gray-200 rounded-xl">
                            No posts found. Create one.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
