import { useEffect, useState } from "react";
import { Music, Play, Pause } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

const FloatingMusicButton = () => {
    const { isPlaying, toggle } = useAudio();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down 100px from top
            const scrolled = window.scrollY > 100;
            setIsVisible(scrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <button
            onClick={toggle}
            className="fixed bottom-[40px] right-[20px] z-50 w-14 h-14 rounded-full gold-gradient shadow-gold hover:shadow-gold-lg transition-all duration-300 flex items-center justify-center group animate-fade-in"
            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
            {isPlaying ? (
                <Pause className="w-6 h-6 text-primary-foreground" />
            ) : (
                <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
            )}

            {/* Optional tooltip on hover */}
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border border-border rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-soft">
                {isPlaying ? "Pausar" : "Reproducir"}
            </span>
        </button>
    );
};

export default FloatingMusicButton;
