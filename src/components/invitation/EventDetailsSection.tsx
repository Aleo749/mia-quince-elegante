import { useInView } from "@/hooks/useInView";
import { Calendar, Clock, MapPin } from "lucide-react";

const EventDetailsSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section 
      ref={ref}
      className="py-20 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Detalles del Evento
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Date */}
          <div 
            className={`text-center p-8 rounded-3xl bg-card border border-border shadow-soft-lg transition-all duration-700 hover:shadow-gold ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Calendar className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Fecha</h3>
            <p className="font-body text-primary font-medium text-lg">15 de Marzo, 2025</p>
            <p className="font-body text-muted-foreground text-sm mt-1">Sábado</p>
          </div>

          {/* Time */}
          <div 
            className={`text-center p-8 rounded-3xl bg-card border border-border shadow-soft-lg transition-all duration-700 hover:shadow-gold ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Clock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Hora</h3>
            <p className="font-body text-primary font-medium text-lg">20:00 hs</p>
            <p className="font-body text-muted-foreground text-sm mt-1">Recepción de invitados</p>
          </div>

          {/* Location */}
          <div 
            className={`text-center p-8 rounded-3xl bg-card border border-border shadow-soft-lg transition-all duration-700 hover:shadow-gold ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Lugar</h3>
            <p className="font-body text-primary font-medium text-lg">Salón Royal Palace</p>
            <p className="font-body text-muted-foreground text-sm mt-1">Av. Principal 1234</p>
          </div>
        </div>

        {/* Map */}
        <div 
          className={`mt-12 rounded-3xl overflow-hidden border border-border shadow-soft-lg transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878894976!2d-58.38375908477042!3d-34.60373888045945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1ses!2sar!4v1635781234567!5m2!1ses!2sar"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del evento"
          />
        </div>
      </div>
    </section>
  );
};

export default EventDetailsSection;