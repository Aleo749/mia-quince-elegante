import { useState, useRef, useEffect } from "react";
import { Sparkles, Play, Pause, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onScrollToRSVP: () => void;
}

const HeroSection = ({ onScrollToRSVP }: HeroSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reproducir automáticamente: estrategia de iniciar silenciado y luego desmutear
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Iniciar silenciado para permitir autoplay (los navegadores permiten autoplay si está silenciado)
    audio.muted = true;
    audio.volume = 1.0;

    const startPlayback = async () => {
      try {
        // Intentar reproducir (estará silenciado inicialmente)
        await audio.play();
        setIsPlaying(true);
        
        // Desmutear después de un breve momento una vez que está reproduciendo
        setTimeout(() => {
          audio.muted = false;
        }, 200);
      } catch (error) {
        // Si aún falla, intentar con interacción del usuario
        console.log("Autoplay bloqueado, se intentará con interacción del usuario");
      }
    };

    // Intentar reproducir cuando el audio esté listo
    const handleCanPlay = () => {
      startPlayback();
    };

    const handleLoadedData = () => {
      startPlayback();
    };

    // Si el audio ya está listo, empezar inmediatamente
    if (audio.readyState >= 2) {
      startPlayback();
    } else {
      audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
      audio.addEventListener('loadeddata', handleLoadedData, { once: true });
    }

    // Fallback: intentar después de un delay
    const fallbackTimer = setTimeout(() => {
      if (audio.paused) {
        startPlayback();
      }
    }, 500);

    // Si el usuario interactúa y el audio no está reproduciéndose, iniciarlo
    const handleUserInteraction = async () => {
      if (audio.paused) {
        audio.muted = false; // Asegurar que no esté silenciado
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error al reproducir audio:", error);
        }
      } else if (audio.muted) {
        // Si está reproduciéndose pero silenciado, desmutear
        audio.muted = false;
      }
    };

    // Escuchar eventos de interacción del usuario
    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      clearTimeout(fallbackTimer);
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  // Sincronizar el estado con los eventos del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error al reproducir audio:", error);
        });
      }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background audio */}
      <audio 
        ref={audioRef} 
        src="/TINI - Siempre Brillarás (Acústico (Audio Only)).mp3" 
        loop 
        preload="auto"
        autoPlay
        playsInline
        muted
      />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-primary rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-primary rounded-full animate-float opacity-50" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-primary rounded-full animate-float opacity-30" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Decorative line top */}
      <div className="w-32 h-px gold-gradient mb-8 animate-fade-in rounded-full" />

      {/* Age badge */}
      <div className="relative mb-6 animate-scale-in">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary flex items-center justify-center glow-gold bg-card shadow-soft-lg">
          <span className="font-display text-5xl md:text-6xl font-semibold text-primary">XV</span>
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-float" />
      </div>

      {/* Title */}
      <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        Mis Quince Años
      </p>

      <h1 
        style={{ animationDelay: "0.3s" }} 
        className="font-display md:text-6xl text-center mb-4 animate-fade-in-up gold-text-gradient lg:text-9xl text-8xl"
      >
        Mia Valentina
      </h1>

      {/* Music Player Button */}
      <button
        onClick={toggleMusic}
        className="flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-soft hover:shadow-soft-lg transition-all duration-300 animate-fade-in-up group"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
          {isPlaying ? (
            <Pause className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
          )}
        </div>
        <div className="text-left">
          <p className="font-body text-xs text-muted-foreground">
            {isPlaying ? "Reproduciendo" : "Toca para escuchar"}
          </p>
          <p className="font-body text-sm text-foreground flex items-center gap-1.5">
            <Music className="w-3 h-3 text-primary" />
            Siempre Brillarás - Tini
          </p>
        </div>
      </button>

      {/* Decorative line */}
      <div className="w-48 h-px gold-gradient mb-8 animate-fade-in rounded-full" style={{ animationDelay: "0.5s" }} />

      {/* Invitation text */}
      <p className="font-body text-center text-muted-foreground max-w-md mb-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.6s" }}>
        Con alegría en mi corazón, te invito a celebrar MI NOCHE SOÑADA
      </p>

      {/* CTA Button */}
      <Button 
        onClick={onScrollToRSVP} 
        size="lg" 
        className="animate-fade-in-up gold-gradient text-primary-foreground font-body font-medium tracking-wide hover:shadow-gold transition-all duration-300 px-8 py-6 text-lg rounded-full" 
        style={{ animationDelay: "0.7s" }}
      >
        Confirmar Asistencia
      </Button>
    </section>
  );
};

export default HeroSection;
