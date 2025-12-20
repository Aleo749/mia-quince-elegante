import { Music, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
    onEnter: () => void;
}

const WelcomeModal = ({ onEnter }: WelcomeModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-3 h-3 bg-primary rounded-full animate-float opacity-40" />
                <div className="absolute top-40 right-20 w-4 h-4 bg-primary rounded-full animate-float opacity-30" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-40 left-20 w-2 h-2 bg-primary rounded-full animate-float opacity-50" style={{ animationDelay: "0.5s" }} />
                <div className="absolute bottom-20 right-10 w-3 h-3 bg-primary rounded-full animate-float opacity-35" style={{ animationDelay: "1.5s" }} />
            </div>

            {/* Modal content */}
            <div className="relative max-w-lg mx-6 text-center animate-scale-in">
                {/* Top decorative line */}
                <div className="w-24 h-px gold-gradient mx-auto mb-8 rounded-full" />

                {/* XV Badge */}
                <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-full border-2 border-primary flex items-center justify-center glow-gold bg-card shadow-soft-lg">
                        <span className="font-display text-6xl font-semibold text-primary">XV</span>
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-float" />
                    <Heart className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-float fill-primary" style={{ animationDelay: "0.5s" }} />
                </div>

                {/* Title */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-4 gold-text-gradient">
                    Mia Fioquetti
                </h1>

                <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-muted-foreground mb-6">
                    Mis Quince Años
                </p>

                {/* Divider */}
                <div className="w-48 h-px gold-gradient mx-auto mb-8 rounded-full" />

                {/* Welcome message */}
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-border mb-8">
                    <p className="font-body text-foreground/90 leading-relaxed">
                        Estás a punto de vivir una experiencia mágica
                    </p>
                </div>

                {/* Enter button */}
                <Button
                    onClick={onEnter}
                    size="lg"
                    className="gold-gradient text-primary-foreground font-body font-medium tracking-wide hover:shadow-gold transition-all duration-300 px-10 py-6 text-lg rounded-full shadow-gold"
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Ingresar a la Celebración
                </Button>

                {/* Bottom decorative line */}
                <div className="w-24 h-px gold-gradient mx-auto mt-8 rounded-full" />
            </div>
        </div>
    );
};

export default WelcomeModal;
