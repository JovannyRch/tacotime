// src/hooks/useRecentHighlights.ts
import { useRef, useState } from "react";

export function useRecentHighlights(durationMs = 1800) {
    const [recent, setRecent] = useState<Set<number | string>>(new Set());
    const timersRef = useRef<Map<number | string, number>>(new Map());

    const markRecent = (id: number | string) => {
        setRecent((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });

        // limpia timer previo si existiera
        const prevTimer = timersRef.current.get(id);
        if (prevTimer) window.clearTimeout(prevTimer);

        const t = window.setTimeout(() => {
            setRecent((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            timersRef.current.delete(id);
        }, durationMs);

        timersRef.current.set(id, t);
    };

    const isRecent = (id: number | string) => recent.has(id);

    return { isRecent, markRecent };
}
