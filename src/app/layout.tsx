import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
// import Footer is handled in layout body
// import AdminToolbar is handled in AdminLayer
import AdminLayer from "@/components/admin/AdminLayer";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Nava Fundacion",
  description: "Narrativa Alternativa Foundation - Dominican Republic",
};

import SmoothScroll from "@/components/anim/SmoothScroll";
import CustomCursor from "@/components/anim/CustomCursor";
import NoiseOverlay from "@/components/anim/NoiseOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexSerif.variable}`}>
      <body className="antialiased bg-[#F4F4F2] text-[#002FA7] md:cursor-none">
        <SmoothScroll>
          <NoiseOverlay />
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
