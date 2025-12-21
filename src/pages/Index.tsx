import { useRef, useState } from "react";
import HeroSection from "@/components/invitation/HeroSection";
import CountdownSection from "@/components/invitation/CountdownSection";
import MessageSection from "@/components/invitation/MessageSection";
import GallerySection from "@/components/invitation/GallerySection";
import EventDetailsSection from "@/components/invitation/EventDetailsSection";
import DressCodeSection from "@/components/invitation/DressCodeSection";
import RSVPSection from "@/components/invitation/RSVPSection";
import GiftRegistrySection from "@/components/invitation/GiftRegistrySection";
import Footer from "@/components/invitation/Footer";
import FloatingMusicButton from "@/components/common/FloatingMusicButton";
import { useAudio } from "@/context/AudioContext";

const Index = () => {
  const rsvpRef = useRef<HTMLElement>(null);
  const countdownRef = useRef<HTMLElement>(null);
  const [showFullInvitation, setShowFullInvitation] = useState(false);
  const { play } = useAudio();

  const scrollToRSVP = () => {
    rsvpRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenInvitation = async () => {
    // Start music playback
    await play();
    // Reveal full invitation content
    setShowFullInvitation(true);
    // Scroll to countdown section after a short delay to ensure content is rendered
    setTimeout(() => {
      countdownRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        <HeroSection onOpenInvitation={handleOpenInvitation} />
        {showFullInvitation && (
          <>
            <CountdownSection countdownRef={countdownRef} />
            <MessageSection />
            <GallerySection />
            <EventDetailsSection />
            <DressCodeSection />
            <RSVPSection rsvpRef={rsvpRef} />
            <GiftRegistrySection />
            <Footer />
          </>
        )}
      </main>
      {showFullInvitation && <FloatingMusicButton />}
    </>
  );
};

export default Index;
