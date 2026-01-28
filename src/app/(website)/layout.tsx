"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export default function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LanguageProvider>
            <Header />
            <main className="flex-grow pt-24 md:pt-32 pb-12 px-4 md:px-6 min-h-screen flex flex-col">
                {children}
                <Footer />
            </main>
        </LanguageProvider>
    );
}
