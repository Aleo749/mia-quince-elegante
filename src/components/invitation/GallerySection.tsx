import { useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useInView";
import { Camera, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import mia1 from "@/assets/gallery/mia-1.jpeg";
import mia2 from "@/assets/gallery/mia-2.jpeg";
import mia3 from "@/assets/gallery/mia-3.jpeg";
import mia4 from "@/assets/gallery/mia-4.jpeg";

const galleryImages = [
  { src: mia1, alt: "Mia de bebé" },
  { src: mia2, alt: "Mia en el tobogán" },
  { src: mia3, alt: "Mia en el auto" },
  { src: mia4, alt: "Mia en el restaurante" },
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
  }, [isLightboxOpen]);

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

  return (
    <section
      ref={ref}
      className="relative section-padding-y section-padding bg-secondary/50"
    >
      {/* Section Number */}
      <span className="section-number">03</span>

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

              {/* Overlay with instructions */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <Maximize2 className="text-white w-12 h-12 drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
              </div>
            </div>

            {/* Gradient Overlays for Better Button Visibility */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/30 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Enhanced Carousel Controls - Always Visible */}
            <button
              onClick={handlePrev}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 backdrop-blur-md hover:bg-white hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-xl z-20 group/btn focus-visible-ring"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover/btn:text-accent transition-colors" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 backdrop-blur-md hover:bg-white hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-xl z-20 group/btn focus-visible-ring"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover/btn:text-accent transition-colors" />
            </button>

            {/* Enhanced Indicators with Counter */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10">
              {/* Image Counter */}
              <div className="text-white/90 text-sm font-medium mb-3 text-center backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                {currentIndex + 1} / {galleryImages.length}
              </div>

              {/* Dots Indicators */}
              <div className="flex gap-2 justify-center">
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
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all duration-300 group"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 md:w-7 md:h-7 text-white/70 group-hover:text-white transition-colors" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 group"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-7 h-7 md:w-10 md:h-10 text-white/70 group-hover:text-white transition-colors" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={galleryImages[currentIndex].src}
              alt={galleryImages[currentIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300 group"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-7 h-7 md:w-10 md:h-10 text-white/70 group-hover:text-white transition-colors" />
          </button>

          {/* Enhanced Counter */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
            <span className="text-white font-medium tracking-wide text-sm md:text-base">
              {currentIndex + 1} / {galleryImages.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
