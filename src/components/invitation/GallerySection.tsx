import { useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useInView";
import { Camera, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import mia1 from "@/assets/gallery/mia-1.jpeg";
import mia2 from "@/assets/gallery/mia-2.jpeg";
import mia3 from "@/assets/gallery/mia-3.jpeg";
import mia4 from "@/assets/gallery/mia-4.jpeg";
import mia5 from "@/assets/gallery/mia-5.jpeg";
import mia6 from "@/assets/gallery/mia-6.jpeg";


const galleryImages = [
  { src: mia1, alt: "Mia de bebé" },
  { src: mia2, alt: "Mia en el tobogán" },
  { src: mia3, alt: "Mia en el auto" },
  { src: mia4, alt: "Mia en el restaurante" },
  { src: mia5, alt: "Mia con vestido blanco" },
  { src: mia6, alt: "Mia en la playa" },
];

const GallerySection = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    if (isLightboxOpen) return; // Pause auto-play when lightbox is open

    const interval = setInterval(() => {
      setSlideDirection('right');
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLightboxOpen, currentIndex]); // Reset timer when currentIndex changes

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  // Touch/Swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section
      ref={ref}
      className="relative section-padding-y section-padding bg-secondary/50"
    >


      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-14 h-14 rounded-full bg-card shadow-soft flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Galería de Recuerdos
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto rounded-full" />
        </div>

        {/* Main Carousel View */}
        <div className={`relative max-w-2xl mx-auto transition-all duration-1000 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
          <div
            className="aspect-[4/5] md:aspect-square relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
            onClick={() => setIsLightboxOpen(true)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Images Container with Slide Effect */}
            <div className="relative w-full h-full">
              {galleryImages.map((image, index) => {
                const isActive = index === currentIndex;
                const isPrev = index === (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                const isNext = index === (currentIndex + 1) % galleryImages.length;

                let transformClass = 'translate-x-0 opacity-100 scale-100';

                if (!isActive) {
                  if (isPrev) {
                    transformClass = '-translate-x-full opacity-0 scale-95';
                  } else if (isNext) {
                    transformClass = 'translate-x-full opacity-0 scale-95';
                  } else {
                    transformClass = 'translate-x-full opacity-0 scale-95';
                  }
                }

                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${transformClass}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}


            </div>

            {/* Gradient Overlays for Better Button Visibility */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Compact Pagination Controls with Counter */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10">
              {/* Image Counter */}
              <div className="text-white/90 text-sm font-medium mb-3 text-center backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                {currentIndex + 1} / {galleryImages.length}
              </div>

              {/* Dots Indicators with Navigation Buttons */}
              <div className="flex items-center gap-3 justify-center">
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  className="w-[30px] h-[30px] rounded-full bg-white/90 backdrop-blur-md hover:bg-white hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-lg z-20 group/btn"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-4 h-4 text-primary group-hover/btn:text-accent transition-colors" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideDirection(index > currentIndex ? 'right' : 'left');
                        setCurrentIndex(index);
                      }}
                      aria-label={`Ir a imagen ${index + 1}`}
                      className={`rounded-full transition-all duration-500 ${index === currentIndex
                        ? "w-10 h-2.5 bg-white shadow-lg"
                        : "w-2.5 h-2.5 bg-white/60 hover:bg-white/90 hover:scale-125"
                        }`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="w-[30px] h-[30px] rounded-full bg-white/90 backdrop-blur-md hover:bg-white hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-lg z-20 group/btn"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-4 h-4 text-primary group-hover/btn:text-accent transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all duration-300 group z-50"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 md:w-7 md:h-7 text-white/70 group-hover:text-white transition-colors" />
          </button>

          {/* Image Container */}
          <div className="relative max-w-5xl w-full flex items-center justify-center flex-1 mb-4">
            <img
              src={galleryImages[currentIndex].src}
              alt={galleryImages[currentIndex].alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Bottom Navigation Controls */}
          <div className="w-full max-w-5xl flex items-center justify-center gap-4 md:gap-8 pb-4 md:pb-6">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 group flex-shrink-0"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white/70 group-hover:text-white transition-colors" />
            </button>

            {/* Counter */}
            <div className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-white/10 backdrop-blur-md flex-shrink-0">
              <span className="text-white font-medium tracking-wide text-sm md:text-base whitespace-nowrap">
                {currentIndex + 1} / {galleryImages.length}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 group flex-shrink-0"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white/70 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
