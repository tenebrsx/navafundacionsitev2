import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/anim/SmoothScroll";
import CustomCursor from "@/components/anim/CustomCursor";
import NoiseOverlay from "@/components/anim/NoiseOverlay";
import LoadingScreen from "@/components/LoadingScreen";
import PageTransition from "@/components/PageTransition";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_URL,
} from "@/lib/site";

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
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        "Nava Fundacion",
        "Narrativa Alternativa",
        "contemporary art",
        "Santo Domingo",
        "Dominican Republic",
        "Caribbean art",
        "exhibition",
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
    },
    verification: {
        google: "C162Q-Ia0QTpCYKwiquGGrP8v907mvLyySvVS6O-iUg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${ibmPlexSerif.variable}`}>
            <body className="antialiased bg-[#F4F4F2] text-[#002FA7] md:cursor-none">
                <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
                <LoadingScreen />
                <PageTransition />
                <SmoothScroll>
                    <NoiseOverlay />
                    <CustomCursor />
                    {children}
                </SmoothScroll>
            </body>
        </html>
    );
}
