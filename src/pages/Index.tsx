import { useRef, useState } from "react";
import HeroSection from "@/components/invitation/HeroSection";
import CountdownSection from "@/components/invitation/CountdownSection";
import MessageSection from "@/components/invitation/MessageSection";
import GallerySection from "@/components/invitation/GallerySection";
import EventDetailsSection from "@/components/invitation/EventDetailsSection";
import DressCodeSection from "@/components/invitation/DressCodeSection";
import RSVPSection from "@/components/invitation/RSVPSection";
import GiftRegistrySection from "@/components/invitation/GiftRegistrySection";
import ContactSection from "@/components/invitation/ContactSection";
import Footer from "@/components/invitation/Footer";
import WelcomeModal from "@/components/common/WelcomeModal";
import { useAudio } from "@/context/AudioContext";

const Index = () => {
  const rsvpRef = useRef<HTMLElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const { play } = useAudio();

  const scrollToRSVP = () => {
    rsvpRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnter = async () => {
    // Start music with full volume (user has interacted)
    await play();
    // Hide modal
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome && <WelcomeModal onEnter={handleEnter} />}
      <main className="min-h-screen bg-background">
        <HeroSection onScrollToRSVP={scrollToRSVP} />
        <CountdownSection />
        <MessageSection />
        <GallerySection />
        <EventDetailsSection />
        <DressCodeSection />
        <RSVPSection rsvpRef={rsvpRef} />
        <GiftRegistrySection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
