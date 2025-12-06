import { useInView } from "@/hooks/useInView";
import { Gift, CreditCard, Wallet } from "lucide-react";

const GiftRegistrySection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section 
      ref={ref}
      className="py-20 px-6 bg-secondary/30"
    >
      <div className="max-w-2xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Gift className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Mesa de Regalos
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto mb-6" />
          <p className="font-body text-foreground/80">
            Tu presencia es el mejor regalo, pero si deseas obsequiarme algo, aquí tienes algunas opciones:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bank Transfer */}
          <div 
            className={`bg-card border border-border rounded-lg p-6 text-center transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-4">Transferencia</h3>
            <div className="space-y-2 text-sm font-body">
              <p className="text-muted-foreground">Banco: Banco Nación</p>
              <p className="text-foreground">CBU: 0110000000000000000001</p>
              <p className="text-muted-foreground">Alias: MIA.QUINCE.2025</p>
            </div>
          </div>

          {/* Digital Wallet */}
          <div 
            className={`bg-card border border-border rounded-lg p-6 text-center transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-4">Billetera Virtual</h3>
            <div className="space-y-2 text-sm font-body">
              <p className="text-muted-foreground">Mercado Pago</p>
              <p className="text-foreground">mia.valentina@email.com</p>
            </div>
            
            {/* QR Placeholder */}
            <div className="mt-4 w-32 h-32 mx-auto bg-foreground/10 rounded-lg flex items-center justify-center border border-border">
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
