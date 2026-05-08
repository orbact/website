import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for scroll-reveal animations using IntersectionObserver.
 * Replaces the duplicated observer logic across all pages.
 * 
 * Usage:
 *   const addToRefs = useScrollReveal([dependency]);
 *   <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
 */
export function useScrollReveal(deps: any[] = []) {
    const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

    const addToRefs = useCallback((el: HTMLDivElement | null) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-20');
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return addToRefs;
}

export default useScrollReveal;
