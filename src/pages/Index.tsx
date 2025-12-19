import { useRef } from "react";
import HeroSection from "@/components/invitation/HeroSection";
import MessageSection from "@/components/invitation/MessageSection";
import GallerySection from "@/components/invitation/GallerySection";
import EventDetailsSection from "@/components/invitation/EventDetailsSection";
import DressCodeSection from "@/components/invitation/DressCodeSection";
import RSVPSection from "@/components/invitation/RSVPSection";
import GiftRegistrySection from "@/components/invitation/GiftRegistrySection";
import ContactSection from "@/components/invitation/ContactSection";
import Footer from "@/components/invitation/Footer";

const Index = () => {
  const rsvpRef = useRef<HTMLElement>(null);

  const scrollToRSVP = () => {
    rsvpRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection onScrollToRSVP={scrollToRSVP} />
      <MessageSection />
      <GallerySection />
      <EventDetailsSection />
      <DressCodeSection />
      <RSVPSection rsvpRef={rsvpRef} />
      <GiftRegistrySection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
