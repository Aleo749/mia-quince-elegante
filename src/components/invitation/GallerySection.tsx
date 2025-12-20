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

  // Auto-advance carousel
  useEffect(() => {
    if (isLightboxOpen) return; // Pause auto-play when lightbox is open

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLightboxOpen]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
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
      className="relative py-20 px-6 bg-secondary/50"
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
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with instructions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Maximize2 className="text-white w-12 h-12 drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
                </div>
              </div>
            ))}

            {/* Gradient Overlay for Controls */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Carousel Controls */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                      ? "w-8 bg-white"
                      : "bg-white/50 hover:bg-white/80"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
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
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-wide">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
