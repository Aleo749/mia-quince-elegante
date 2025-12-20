import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
    isPlaying: boolean;
    toggle: () => void;
    play: () => Promise<void>;
    pause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element
        const audio = new Audio("/TINI - Siempre Brillarás (Acústico (Audio Only)).mp3");
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;

        // Sync state
        const updateState = () => setIsPlaying(!audio.paused);
        audio.addEventListener('play', updateState);
        audio.addEventListener('pause', updateState);
        audio.addEventListener('ended', updateState);

        // Estrategia de Autoplay Silenciado + Desmutear al interactuar
        const attemptAutoplay = async () => {
            try {
                // 1. Intentar reproducir silenciado (generalmente permitido)
                audio.muted = true;
                await audio.play();
                console.log("Autoplay silenciado exitoso");

                // 2. Escuchar la primera interacción para desmutear
                const unmuteOnInteraction = () => {
                    if (audio) {
                        audio.muted = false;
                        audio.volume = 1.0;
                    }
                    // Remover listeners
                    ['click', 'touchstart', 'keydown', 'scroll'].forEach(event =>
                        window.removeEventListener(event, unmuteOnInteraction)
                    );
                };

                // Agregar listeners
                ['click', 'touchstart', 'keydown', 'scroll'].forEach(event =>
                    window.addEventListener(event, unmuteOnInteraction, { once: true })
                );

            } catch (error) {
                console.log("Autoplay silenciado falló:", error);

                // Fallback: Si falla incluso silenciado, esperar a interacción para reproducir
                const playOnInteraction = async () => {
                    try {
                        await audio.play();
                        audio.muted = false;
                    } catch (e) {
                        console.error("Play on interaction failed", e);
                    }
                    ['click', 'touchstart', 'keydown'].forEach(event =>
                        window.removeEventListener(event, playOnInteraction)
                    );
                };
                ['click', 'touchstart', 'keydown'].forEach(event =>
                    window.addEventListener(event, playOnInteraction, { once: true })
                );
            }
        };

        attemptAutoplay();

        return () => {
            audio.pause();
            audio.removeEventListener('play', updateState);
            audio.removeEventListener('pause', updateState);
            audio.removeEventListener('ended', updateState);
            audioRef.current = null;
        };
    }, []);


    const play = React.useCallback(async () => {
        if (audioRef.current) {
            try {
                // Unmute if it's muted (in case of explicit play call)
                if (audioRef.current.muted) {
                    audioRef.current.muted = false;
                    audioRef.current.volume = 1.0;
                }
                await audioRef.current.play();
            } catch (error) {
                console.error("Playback failed:", error);
            }
        }
    }, []);


    const pause = React.useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    const toggle = React.useCallback(() => {
        if (audioRef.current) {
            if (audioRef.current.paused) play();
            else pause();
        }
    }, [play, pause]);

    const value = React.useMemo(() => ({ isPlaying, toggle, play, pause }), [isPlaying, toggle, play, pause]);

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
