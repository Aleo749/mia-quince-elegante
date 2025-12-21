import { useInView } from "@/hooks/useInView";
import { Calendar, Clock, MapPin } from "lucide-react";


const EventDetailsSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="relative py-20 px-6"
    >


      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Detalles del Evento
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Date */}
          <div
            className={`text-center p-8 md:p-10 rounded-3xl bg-card border border-border shadow-soft-lg transition-all duration-700 hover:shadow-gold ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Calendar className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Fecha</h3>
            <p className="font-body text-primary font-medium text-lg">7 de Febrero, 2025</p>
            <p className="font-body text-muted-foreground text-sm mt-1">Viernes</p>
          </div>

          {/* Time */}
          <div
            className={`text-center p-8 md:p-10 rounded-3xl bg-card border border-border shadow-soft-lg transition-all duration-700 hover:shadow-gold ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Clock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Hora</h3>
            <p className="font-body text-primary font-medium text-lg">20:30 hs</p>
            <p className="font-body text-muted-foreground text-sm mt-1">Hasta las 05:00 hs</p>
          </div>

          {/* Location */}
          <div
            className={`text-center p-8 md:p-10 rounded-3xl bg-card border border-border shadow-soft-lg transition-all duration-700 hover:shadow-gold ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Lugar</h3>
            <p className="font-body text-primary font-medium text-lg">Quincho La Tranquera</p>
            <p className="font-body text-muted-foreground text-sm mt-1">Laprida 2482</p>
          </div>
        </div>

        {/* Map */}
        <div
          className={`mt-12 rounded-3xl overflow-hidden border border-border shadow-soft-lg transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '400ms' }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3346.8919236753!2d-68.79172152389!3d-33.01942117349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e760e52f1e5eb%3A0x7e8b8c2a1d3e5f6a!2sQuincho%20La%20Tranquera!5e0!3m2!1ses-419!2sar!4v1734727000000!5m2!1ses-419!2sar"
            width="100%"
            height="350"
            className="md:h-[400px]"
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
