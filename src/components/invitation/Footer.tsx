import { Heart, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-card border-t border-border">
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative elements */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <Heart className="w-6 h-6 text-primary animate-pulse" />
          <Sparkles className="w-5 h-5 text-primary" />
        </div>

        {/* Message */}
        <p className="font-display text-2xl text-primary mb-4">
          ¡Te esperamos!
        </p>

        <p className="font-body text-muted-foreground text-sm mb-6">
          Con amor y emoción
        </p>

        {/* Signature */}
        <p className="font-display text-3xl gold-text-gradient mb-8">
          Mia Fioquetti
        </p>

        {/* Copyright */}
        <div className="w-24 h-px gold-gradient mx-auto mb-4 rounded-full" />
        <p className="font-body text-xs text-muted-foreground">
          © 2025 - Mis XV Años
        </p>
      </div>
    </footer>
  );
};

export default Footer;