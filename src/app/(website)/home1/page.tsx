"use client";

import { useSmartEvent } from "@/hooks/useSmartEvent"; // Keep hooks if needed for Right Sidebar
import { useEffect, useState } from "react";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import PageBuilder from "@/components/admin/visual/PageBuilder";
import { useLanguage } from "@/context/LanguageContext";
import { useVisualEditor } from "@/components/admin/visual/VisualEditorContext";

interface Movement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function Home() {
  const { isEditing } = useVisualEditor();
  const [events, setEvents] = useState<Movement[]>([]);
  const [contentDoc, setContentDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Derive blocks from Live or Draft
  // Move 2: Airlock Logic
  const blocks = (isEditing && contentDoc?.draft?.blocks)
    ? contentDoc.draft.blocks
    : (contentDoc?.blocks || []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Movements for Sidebar
        const q = query(collection(db, "movements"));
        const movementsSnap = await getDocs(q);
        const movementsData = movementsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Movement[];
        setEvents(movementsData);

        // Fetch Home Content (Blocks)
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setContentDoc(data);

          if (!data.blocks) {
            // Default Migration
            const defaultBlocks = [
              { id: "hero", type: "smart_hero", data: {} },
              {
                id: "archive", type: "split", data: {
                  title: "Past Movements",
                  layout: "image-left",
                  body: "Explore our exhibition history via the digital archive.",
                  caption: "Archive 2023-2025"
                }
              },
              {
                id: "about", type: "split", data: {
                  title: "The Foundation",
                  layout: "image-right",
                  body: "Learn more about our mission and history.",
                  caption: "About Us"
                }
              }
            ];
            // If default, we set it to contentDoc structure in memory
            setContentDoc({ ...data, blocks: defaultBlocks });
          }
        } else {
          // totally empty doc
          setContentDoc({
            blocks: [
              { id: "hero", type: "smart_hero", data: {} }
            ]
          });
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 md:px-8">

      {/* Disclaimer / Mobile Header Alternative */}
      <section className="mb-12 md:hidden">
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
          Nava<br />Fundacion
        </h1>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">

        {/* Main Content Area (Page Builder) */}
        <div className="md:col-span-8 flex flex-col gap-16 min-h-[500px]">
          <PageBuilder
            id="home"
            path="content"
            blocks={blocks}
          />
        </div>

        {/* Sidebar (Right 1/3 - Hardcoded Upcoming Events) */}
        <div className="md:col-span-4 flex flex-col gap-12 border-l border-zinc-900 md:pl-8">

          {/* Upcoming List */}
          <div className="relative">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-6">
              <h2 className="font-mono text-sm uppercase text-gray-400">Upcoming</h2>
              <Link href="/admin/events" className="text-[10px] uppercase text-nava-green font-bold hover:underline opacity-0 hover:opacity-100 transition-opacity">Manage Events</Link>
            </div>

            {loading ? (
              <div className="text-zinc-600">Loading schedule...</div>
            ) : events.length > 0 ? (
              <div className="flex flex-col gap-6">
                {events.map((item) => (
                  <Link key={item.id} href={`/events/${item.id}`} className="group cursor-pointer block">
                    <span className="block font-mono text-xs text-nava-green mb-1">{item.date}</span>
                    <h3 className="text-xl font-bold uppercase leading-tight group-hover:underline decoration-1 underline-offset-4">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-zinc-600 text-sm">No upcoming events scheduled.</div>
            )}

            <div className="mt-4 pt-4 border-t border-zinc-900 md:hidden">
              <Link href="/admin/events" className="w-full block bg-zinc-900 text-zinc-400 text-center py-2 text-xs uppercase font-bold hover:bg-zinc-800">Manage Events</Link>
            </div>
          </div>

          <div className="bg-white text-black p-6 mt-auto">
            <h3 className="font-bold uppercase text-xl mb-4 leading-none">Subscribe to our newsletter</h3>
            <input type="email" placeholder="EMAIL ADDRESS" className="w-full border-b border-black bg-transparent py-2 outline-none placeholder:text-zinc-500 mb-4" />
            <button className="text-xs font-bold uppercase border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">Submit</button>
          </div>

        </div>

      </div>
    </div>
  );
}
