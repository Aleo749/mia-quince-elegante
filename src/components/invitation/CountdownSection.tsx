import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Fecha del evento: 15 de marzo de 2025 a las 20:00 hrs (hora local)
    // Mes 2 = marzo (0-indexed en JavaScript)
    const finalEventDate = new Date(2026, 2, 15, 20, 0, 0);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = finalEventDate.getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      setIsExpired(false);
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    // Calcular inmediatamente
    setTimeLeft(calculateTimeLeft());

    // Actualizar cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4 md:mx-6 lg:mx-8">
      <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display text-primary tracking-tighter mb-2">
        {value}
      </span>
      <span className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-muted-foreground font-light">
        {label}
      </span>
    </div>
  );

  return (
    <section
      ref={ref}
      className="relative section-padding-y section-padding overflow-hidden bg-background"
    >
      <div
        className={`max-w-7xl mx-auto text-center transition-all duration-1000 transform ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {!isExpired ? (
          <>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display uppercase tracking-widest mb-12 sm:mb-16 md:mb-20 lg:mb-24 text-foreground/80 px-4">
              Falta poco para vivir un día mágico
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-y-6">
              <CountdownItem value={timeLeft.days} label="Días" />
              <CountdownItem value={timeLeft.hours} label="Horas" />
              <CountdownItem value={timeLeft.minutes} label="Minutos" />
              <CountdownItem value={timeLeft.seconds} label="Segundos" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center animate-fade-in px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display uppercase tracking-widest mb-6 text-primary">
              ¡El Evento ha Comenzado!
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
              Esperamos verte allí
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CountdownSection;


