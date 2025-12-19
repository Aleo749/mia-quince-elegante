import { useInView } from "@/hooks/useInView";
import { Camera } from "lucide-react";
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

  return (
    <section 
      ref={ref}
      className="relative py-20 px-6 bg-secondary/50"
    >
      {/* Section Number */}
      <span className="section-number">02</span>

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-2xl group transition-all duration-700 shadow-soft ${
                isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
