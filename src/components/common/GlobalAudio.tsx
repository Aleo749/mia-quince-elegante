import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

const GlobalAudio = () => {
    const { play } = useAudio();
    const hasAttemptedRef = useRef(false);

    useEffect(() => {
        // Only run this logic once per mount
        if (hasAttemptedRef.current) return;
        hasAttemptedRef.current = true;

        // Attempt autoplay immediately
        play().catch(() => {
            console.log("Autoplay blocked, waiting for interaction...");
        });

        const handleInteraction = () => {
            // Try to play on first interaction
            play();
        };

        const events = ['click', 'touchstart', 'scroll', 'keydown'];

        // Wrapper to remove listeners after first interaction
        const onInteraction = () => {
            handleInteraction();
            events.forEach(event => {
                window.removeEventListener(event, onInteraction);
            });
        };

        events.forEach(event => {
            window.addEventListener(event, onInteraction, { once: true });
        });

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, onInteraction);
            });
        };
    }, [play]); // play is now stable thanks to useCallback

    return null; // Invisible
};

export default GlobalAudio;
