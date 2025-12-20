import { useInView } from "@/hooks/useInView";
import { Shirt } from "lucide-react";

const DressCodeSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative section-padding-y section-padding bg-secondary/50"
    >
      {/* Section Number */}
      <span className="section-number">04</span>

      <div className="max-w-2xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-14 h-14 rounded-full bg-card shadow-soft flex items-center justify-center mx-auto mb-4">
            <Shirt className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Código de Vestimenta
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto mb-8 rounded-full" />
        </div>

        <div
          className={`bg-card border border-border rounded-3xl p-8 shadow-soft-lg transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="font-display text-2xl text-primary mb-4">Elegante / Formal</p>
          <p className="font-body text-foreground/80 leading-relaxed mb-6">
            Te invitamos a vestir de manera elegante para esta ocasión especial.
            Queremos que todos brillemos en esta noche mágica.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 shadow-soft">
              <span className="text-primary font-body text-sm font-medium">Vestido largo</span>
            </div>
            <div className="px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 shadow-soft">
              <span className="text-primary font-body text-sm font-medium">Traje formal</span>
            </div>
            <div className="px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 shadow-soft">
              <span className="text-primary font-body text-sm font-medium">Colores sobrios</span>
            </div>
          </div>

          <p className="font-body text-muted-foreground text-sm mt-6">
            * Evitar colores blanco y rosa (reservados para la quinceañera)
          </p>
        </div>
      </div>
    </section>
  );
};

export default DressCodeSection;
