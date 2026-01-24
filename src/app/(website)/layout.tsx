"use client";

import Header from "@/components/Header";
import AdminLayer from "@/components/admin/AdminLayer";
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
            <main className="flex-grow pt-24 md:pt-32 pb-12 px-4 md:px-6">
                <AdminLayer>
                    {children}
                    <Footer />
                </AdminLayer>
            </main>
        </LanguageProvider>
    );
}
