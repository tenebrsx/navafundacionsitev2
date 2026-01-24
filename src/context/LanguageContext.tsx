"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (en: string, es?: string) => string; // Helper to pick string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("nava_lang") as Language;
        if (saved && (saved === "en" || saved === "es")) {
            setLanguage(saved);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "es" : "en";
        setLanguage(newLang);
        localStorage.setItem("nava_lang", newLang);
    };

    // Helper: Returns English by default, Spanish if lang is 'es' AND spanish text is provided
    const t = (en: string | undefined, es?: string | undefined) => {
        if (language === "es" && es) return es;
        return en || "";
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
