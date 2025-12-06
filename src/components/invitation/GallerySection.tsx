import { useInView } from "@/hooks/useInView";
import { Camera } from "lucide-react";

const placeholderImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=400&fit=crop",
];

const GallerySection = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className="py-20 px-6 bg-secondary/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Camera className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Galería de Recuerdos
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {placeholderImages.map((src, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-lg group transition-all duration-700 ${
                isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <img
                src={src}
                alt={`Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8 font-body text-sm">
          * Las fotos serán reemplazadas con imágenes reales
        </p>
      </div>
    </section>
  );
};

export default GallerySection;
