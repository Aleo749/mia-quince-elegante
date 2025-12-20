import { useInView } from "@/hooks/useInView";
import { Gift, CreditCard, Wallet } from "lucide-react";


const GiftRegistrySection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative section-padding-y section-padding bg-secondary/50"
    >


      <div className="max-w-2xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-14 h-14 rounded-full bg-card shadow-soft flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Mesa de Regalos
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto mb-6 rounded-full" />
          <p className="font-body text-foreground/80">
            Tu presencia es el mejor regalo, pero si deseas obsequiarme algo, aquí tienes algunas opciones:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bank Transfer */}
          <div
            className={`bg-card border border-border rounded-3xl p-8 text-center shadow-soft-lg transition-all duration-700 hover:shadow-gold ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <CreditCard className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-4">Transferencia</h3>
            <div className="space-y-2 text-sm font-body">
              <p className="text-muted-foreground">CVU</p>
              <p className="text-foreground font-medium">0000003100072830126087</p>
            </div>
          </div>

          {/* Digital Wallet */}
          <div
            className={`bg-card border border-border rounded-3xl p-8 text-center shadow-soft-lg transition-all duration-700 hover:shadow-gold ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Wallet className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-4">Billetera Virtual</h3>
            <div className="space-y-2 text-sm font-body">
              <p className="text-muted-foreground">Mercado Pago</p>
              <p className="text-foreground font-medium">miafioquetti.mp</p>
            </div>

            {/* QR Placeholder */}
            <div className="mt-4 w-32 h-32 mx-auto bg-secondary/50 rounded-2xl flex items-center justify-center border border-border">
              <span className="text-muted-foreground text-xs">QR Code</span>
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-8 font-body text-sm italic">
          "Gracias por formar parte de este momento especial"
        </p>
      </div>
    </section>
  );
};

export default GiftRegistrySection;
