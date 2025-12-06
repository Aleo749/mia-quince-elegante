import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onScrollToRSVP: () => void;
}

const HeroSection = ({ onScrollToRSVP }: HeroSectionProps) => {
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
      <div className="w-32 h-px gold-gradient mb-8 animate-fade-in" />

      {/* Age badge */}
      <div className="relative mb-6 animate-scale-in">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary flex items-center justify-center glow-gold">
          <span className="font-display text-5xl md:text-6xl font-semibold text-primary">XV</span>
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-float" />
      </div>

      {/* Title */}
      <p className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        Mis Quince Años
      </p>

      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-center mb-2 animate-fade-in-up gold-text-gradient" style={{ animationDelay: "0.3s" }}>
        Mia Valentina
      </h1>
      
      <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-center mb-8 animate-fade-in-up text-foreground" style={{ animationDelay: "0.4s" }}>
        Fioquetti
      </h2>

      {/* Decorative line */}
      <div className="w-48 h-px gold-gradient mb-8 animate-fade-in" style={{ animationDelay: "0.5s" }} />

      {/* Invitation text */}
      <p className="font-body text-center text-muted-foreground max-w-md mb-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.6s" }}>
        Con alegría en mi corazón, te invito a celebrar conmigo este día tan especial en mi vida
      </p>

      {/* CTA Button */}
      <Button
        onClick={onScrollToRSVP}
        size="lg"
        className="animate-fade-in-up gold-gradient text-primary-foreground font-body font-medium tracking-wide hover:shadow-gold transition-all duration-300 px-8 py-6 text-lg"
        style={{ animationDelay: "0.7s" }}
      >
        Confirmar Asistencia
      </Button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
