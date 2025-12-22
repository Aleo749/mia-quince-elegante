import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Phone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";


const ContactSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [copiedPapa, setCopiedPapa] = useState(false);
  const [copiedStella, setCopiedStella] = useState(false);

  const PAPA_PHONE = "1542612097811";
  const STELLA_PHONE = "1542612051261";

  const handleCopy = async (phone: string, type: 'papa' | 'stella') => {
    try {
      await navigator.clipboard.writeText(phone);
      if (type === 'papa') {
        setCopiedPapa(true);
        setTimeout(() => setCopiedPapa(false), 2000);
      } else {
        setCopiedStella(true);
        setTimeout(() => setCopiedStella(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section
      ref={ref}
      className="relative section-padding-y section-padding"
    >


      <div className="max-w-2xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-14 h-14 rounded-full bg-card shadow-soft flex items-center justify-center mx-auto mb-4">
            <Phone className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Contacto
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto mb-8 rounded-full" />
        </div>

        <div
          className={`bg-card border border-border rounded-3xl p-8 shadow-soft-lg transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="font-body text-foreground/80 mb-6">
            Para cualquier consulta, no dudes en comunicarte con nosotros:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-secondary/50">
              <p className="font-display text-lg text-foreground mb-2">Papá de Mia</p>
              <p className="font-body text-foreground font-medium mb-3">{PAPA_PHONE}</p>
              <Button
                onClick={() => handleCopy(PAPA_PHONE, 'papa')}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                {copiedPapa ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar Teléfono
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50">
              <p className="font-display text-lg text-foreground mb-2">Stella</p>
              <p className="font-body text-foreground font-medium mb-3">{STELLA_PHONE}</p>
              <Button
                onClick={() => handleCopy(STELLA_PHONE, 'stella')}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                {copiedStella ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar Teléfono
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
