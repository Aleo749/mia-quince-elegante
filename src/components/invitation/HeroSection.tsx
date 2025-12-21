import { useRef } from "react";
import { Sparkles, Play, Pause, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/context/AudioContext";

interface HeroSectionProps {
  onOpenInvitation: () => void;
}

const HeroSection = ({ onOpenInvitation }: HeroSectionProps) => {
  const { isPlaying, toggle } = useAudio();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
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
        className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-center mb-4 animate-fade-in-up gold-text-gradient"
      >
        Mia Valentina
      </h1>


      {/* Decorative line */}
      <div className="w-48 h-px gold-gradient mb-8 animate-fade-in rounded-full" style={{ animationDelay: "0.5s" }} />

      {/* Invitation text */}
      <p className="font-body text-center text-muted-foreground max-w-md mb-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.6s" }}>
        Con alegría en mi corazón, te invito a celebrar MI NOCHE SOÑADA
      </p>

      {/* CTA Button */}
      <Button
        onClick={onOpenInvitation}
        size="lg"
        className="animate-fade-in-up gold-gradient text-primary-foreground font-body font-medium tracking-wide hover:shadow-gold transition-all duration-300 px-8 py-6 text-lg rounded-full"
        style={{ animationDelay: "0.7s" }}
      >
        Abrir invitación
      </Button>
    </section>
  );
};

export default HeroSection;
