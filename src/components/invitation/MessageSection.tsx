import { Heart } from "lucide-react";
import { useInView } from "@/hooks/useInView";


const MessageSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative section-padding-y section-padding flex flex-col items-center"
    >


      <div className={`max-w-2xl text-center transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="w-14 h-14 rounded-full bg-card shadow-soft flex items-center justify-center mx-auto mb-6">
          <Heart className="w-7 h-7 text-primary" />
        </div>

        <h2 className="font-display text-3xl md:text-4xl mb-6 text-primary">
          Un Momento Mágico
        </h2>

        <div className="w-24 h-px gold-gradient mx-auto mb-8 rounded-full" />

        <div className="bg-card rounded-3xl p-8 shadow-soft-lg">
          <p className="font-body text-foreground/90 leading-relaxed mb-6">
            Los quince años marcan el inicio de una nueva etapa en la vida de toda joven.
            Es un momento de transición, de sueños y de esperanzas.
          </p>

          <p className="font-body text-foreground/90 leading-relaxed mb-6">
            Quiero compartir esta celebración tan importante contigo,
            rodeada de las personas que más quiero.
          </p>

          <p className="font-display text-xl text-primary italic">
            "Cada momento juntos es un recuerdo que atesoro"
          </p>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
