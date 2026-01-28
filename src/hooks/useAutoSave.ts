import { useEffect, useRef, useState, useCallback } from 'react';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function useAutoSave(
    collectionName: string,
    id: string | null,
    formData: any,
    isNew: boolean
) {
    const router = useRouter();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [docId, setDocId] = useState<string | null>(id === 'new' ? null : id);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedData = useRef<string>(JSON.stringify(formData));

    const debouncedSave = useCallback((data: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            // Check if data actually changed
            const currentString = JSON.stringify(data);
            if (currentString === lastSavedData.current) return;

            setSaveStatus('saving');
            try {
                // Ensure status is draft for auto-save
                const dataToSave = { ...data, status: 'draft', updatedAt: new Date().toISOString() };

                if (docId) {
                    // Update existing
                    await updateDoc(doc(db, collectionName, docId), dataToSave);
                    setSaveStatus('saved');
                    lastSavedData.current = currentString;
                } else if (isNew && data.title && data.title.length > 2) {
                    // Create new if generic "isNew" flag is true AND we have a title
                    // Only create if we don't have a docId yet
                    const ref = await addDoc(collection(db, collectionName), {
                        ...dataToSave,
                        createdAt: new Date().toISOString()
                    });
                    setDocId(ref.id);
                    setSaveStatus('saved');
                    lastSavedData.current = currentString;

                    // Update URL silently? Next.js router.replace might trigger reload
                    // We might just keep internal docId for now and let user redirect on "Upload"
                    // Or better, replace URL so they can refresh
                    window.history.replaceState(null, '', `/admin/${collectionName}/${ref.id}`);
                }
            } catch (error) {
                console.error("Auto-save error:", error);
                setSaveStatus('error');
            }
        }, 2000); // 2 second delay
    }, [collectionName, docId, isNew]);

    useEffect(() => {
        // Skip initial render or empty states
        if (isNew && !formData.title) return;

        debouncedSave(formData);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [formData, debouncedSave, isNew]);

    return { saveStatus, docId };
}
