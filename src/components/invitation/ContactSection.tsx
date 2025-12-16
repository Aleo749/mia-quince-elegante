import { useInView } from "@/hooks/useInView";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section 
      ref={ref}
      className="py-20 px-6"
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
          className={`bg-card border border-border rounded-3xl p-8 shadow-soft-lg transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="font-body text-foreground/80 mb-6">
            Para cualquier consulta, no dudes en comunicarte con nosotros:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-secondary/50">
              <p className="font-display text-lg text-foreground">Mamá de Mia</p>
              <p className="font-body text-muted-foreground">+54 9 11 1234-5678</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50">
              <p className="font-display text-lg text-foreground">Papá de Mia</p>
              <p className="font-body text-muted-foreground">+54 9 11 8765-4321</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="border-green-500/30 text-green-600 hover:bg-green-500/5 rounded-full"
              onClick={() => window.open("https://wa.me/5491112345678", "_blank")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Mamá
            </Button>
            <Button
              variant="outline"
              className="border-green-500/30 text-green-600 hover:bg-green-500/5 rounded-full"
              onClick={() => window.open("https://wa.me/5491187654321", "_blank")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Papá
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;