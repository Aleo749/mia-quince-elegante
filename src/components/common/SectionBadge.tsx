import React from 'react';
import { Sparkles } from 'lucide-react';

interface SectionBadgeProps {
    number: string;
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ number }) => {
    return (
        <div className="absolute top-6 right-6 pointer-events-none select-none z-10">
            {/* Main badge container with glassmorphism */}
            <div className="relative group">
                {/* Glow effect behind */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Main badge */}
                <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-card/40 backdrop-blur-md border border-primary/20 shadow-soft overflow-hidden">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

                    {/* Number */}
                    <span className="relative font-display text-2xl md:text-3xl font-semibold text-primary/80 z-10">
                        {number}
                    </span>

                    {/* Small decorative sparkle */}
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary/40 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SectionBadge;
