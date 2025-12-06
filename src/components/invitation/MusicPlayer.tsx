import { useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Here you would control the actual audio element
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleMute}
        size="icon"
        className="w-12 h-12 rounded-full gold-gradient shadow-gold hover:scale-110 transition-transform"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-primary-foreground" />
        )}
      </Button>
      
      {/* Music indicator */}
      {!isMuted && (
        <div className="absolute -top-2 -left-2 flex gap-1">
          <Music className="w-4 h-4 text-primary animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
