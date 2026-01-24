import { useMemo } from 'react';

interface Movement {
    id: string;
    title: string;
    startDate?: string; // ISO YYYY-MM-DD
    endDate?: string;   // ISO YYYY-MM-DD
    imageUrl?: string;
    description: string;
    date: string; // Display text
    [key: string]: any;
}

export function useSmartEvent(movements: Movement[]) {
    return useMemo(() => {
        if (!movements || movements.length === 0) return null;

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // 1. Sort movements by startDate
        const sorted = [...movements].sort((a, b) => {
            const dateA = a.startDate || "9999-99-99";
            const dateB = b.startDate || "9999-99-99";
            return dateA.localeCompare(dateB);
        });

        // 2. Find Active Event (Today is between Start and End)
        // If multiple, picking the one that started most recently? Or just first found?
        // Let's pick first found in sorted list.
        const active = sorted.find(m => {
            if (!m.startDate || !m.endDate) return false;
            return today >= m.startDate && today <= m.endDate;
        });

        if (active) return active;

        // 3. If no active event, find Next Upcoming (Start date > Today)
        const nextUp = sorted.find(m => {
            if (!m.startDate) return false;
            return m.startDate > today;
        });

        if (nextUp) return nextUp;

        // 4. Fallback: If no future events, maybe show the last one that ended? 
        // Or just the last one in the list?
        // Let's fallback to the last event in validity (or just the last one sorted) to show *something*.
        // Actually, "Current Exhibition" implies something is there. If everything is past, maybe just show the most recent past one?
        // Let's return the last one in the sorted list (most distant future, or most recent past if all past?)
        // Sort is by StartDate ASC. Last item is latest start date.
        return sorted[sorted.length - 1];

    }, [movements]);
}
