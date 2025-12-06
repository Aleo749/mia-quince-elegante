import { useInView } from "@/hooks/useInView";
import { Shirt } from "lucide-react";

const DressCodeSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section 
      ref={ref}
      className="py-20 px-6 bg-secondary/30"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Shirt className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Código de Vestimenta
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto mb-8" />
        </div>

        <div 
          className={`bg-card border border-border rounded-lg p-8 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="font-display text-2xl text-primary mb-4">Elegante / Formal</p>
          <p className="font-body text-foreground/80 leading-relaxed mb-6">
            Te invitamos a vestir de manera elegante para esta ocasión especial. 
            Queremos que todos brillemos en esta noche mágica.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 rounded-full border border-primary/50 bg-primary/10">
              <span className="text-primary font-body text-sm">Vestido largo</span>
            </div>
            <div className="px-4 py-2 rounded-full border border-primary/50 bg-primary/10">
              <span className="text-primary font-body text-sm">Traje formal</span>
            </div>
            <div className="px-4 py-2 rounded-full border border-primary/50 bg-primary/10">
              <span className="text-primary font-body text-sm">Colores sobrios</span>
            </div>
          </div>

          <p className="font-body text-muted-foreground text-sm mt-6">
            * Evitar colores blanco y azul rey (reservados para la quinceañera)
          </p>
        </div>
      </div>
    </section>
  );
};

export default DressCodeSection;
