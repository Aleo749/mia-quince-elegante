import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import { Sparkles, Clock } from "lucide-react";

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
    const finalEventDate = new Date(2025, 2, 15, 20, 0, 0);

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
      const calculated = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
      
      return calculated;
    };

    // Calcular inmediatamente
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    // Actualizar cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CountdownCard = ({ 
    value, 
    label, 
    delay,
    isSeconds = false
  }: { 
    value: number; 
    label: string; 
    delay: string;
    isSeconds?: boolean;
  }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [prevValue, setPrevValue] = useState(value);
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      if (value !== prevValue) {
        setIsAnimating(true);
        // Animación de flip para el cambio de número
        setTimeout(() => {
          setDisplayValue(value);
          setPrevValue(value);
        }, 200);
        const timer = setTimeout(() => setIsAnimating(false), 600);
        return () => clearTimeout(timer);
      }
    }, [value, prevValue]);

    return (
      <div
        className={`relative flex flex-col items-center justify-center transition-all duration-1000 ${
          isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-100 translate-y-0 scale-100"
        }`}
        style={{ transitionDelay: delay }}
      >
        {/* Partículas mágicas flotantes */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-float opacity-40"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Carta principal con estilo mágico */}
        <div className="relative w-full aspect-square" style={{ maxWidth: 'min(45vw, 320px)' }}>
          {/* Aura mágica de fondo */}
          <div className="absolute -inset-4 gold-gradient rounded-3xl blur-2xl opacity-20 animate-pulse" />
          <div className={`absolute -inset-2 gold-gradient rounded-3xl blur-lg opacity-30 transition-all duration-1000 ${
            isAnimating ? "scale-110 opacity-50" : "scale-100"
          }`} />
          
          {/* Contenedor principal */}
          <div className="relative h-full bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/50 rounded-3xl shadow-gold overflow-hidden backdrop-blur-sm">
            {/* Efecto de brillo mágico animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent animate-shimmer" />
            <div className={`absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent transition-opacity duration-300 ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`} />
            
            {/* Contenido */}
            <div className="relative h-full flex flex-col items-center justify-center p-4 md:p-6">
              {/* Valor numérico con efecto mágico */}
              <div className="relative">
                {/* Número anterior (desvaneciéndose) */}
                {isAnimating && (
                  <span
                    className="absolute inset-0 flex items-center justify-center font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold gold-text-gradient leading-none opacity-0 animate-fade-out"
                    style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}
                  >
                    {String(prevValue).padStart(2, "0")}
                  </span>
                )}
                
                {/* Número actual (apareciendo) */}
                <span
                  className={`block font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold gold-text-gradient leading-none transition-all duration-500 ${
                    isAnimating ? "scale-125 opacity-100 animate-bounce-subtle" : "scale-100 opacity-100"
                  }`}
                  style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}
                >
                  {String(displayValue).padStart(2, "0")}
                </span>
                
                {/* Efecto de resplandor mágico en el número */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span 
                    className={`font-display font-bold text-primary/25 blur-md leading-none transition-opacity duration-500 ${
                      isAnimating ? "opacity-50 animate-pulse" : "opacity-30"
                    }`}
                    style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}
                  >
                    {String(displayValue).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Etiqueta con efecto mágico */}
              <p className={`mt-2 md:mt-4 font-body text-xs sm:text-sm md:text-base uppercase tracking-wider text-muted-foreground font-medium transition-all duration-300 ${
                isAnimating && isSeconds ? "text-primary scale-110" : ""
              }`}>
                {label}
              </p>
            </div>

            {/* Estrellas mágicas decorativas */}
            <div className="absolute top-3 right-3">
              <Sparkles className={`w-4 h-4 text-primary animate-float opacity-70 transition-all duration-300 ${
                isAnimating && isSeconds ? "scale-150 opacity-100" : ""
              }`} />
            </div>
            <div className="absolute bottom-3 left-3">
              <Sparkles className={`w-3 h-3 text-primary animate-float opacity-60 transition-all duration-300 ${
                isAnimating && isSeconds ? "scale-150 opacity-100" : ""
              }`} style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Sección número */}
      <span className="section-number">02</span>

      {/* Partículas de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Líneas decorativas de fondo */}
      <div className="absolute top-1/4 left-0 w-full h-px gold-gradient opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-full h-px gold-gradient opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="max-w-7xl mx-auto">
        {/* Texto mágico principal */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-6 gold-text-gradient">
            Falta poco para vivir un día mágico:
          </p>
          {/* Línea decorativa dorada */}
          <div className="w-32 h-px gold-gradient mx-auto rounded-full" />
        </div>

        {/* Contador principal con estilo mágico Disney */}
        {!isExpired ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 min-h-[300px]">
            <CountdownCard value={timeLeft.days} label="Días" delay="100ms" />
            <CountdownCard value={timeLeft.hours} label="Horas" delay="200ms" />
            <CountdownCard value={timeLeft.minutes} label="Minutos" delay="300ms" />
            <CountdownCard value={timeLeft.seconds} label="Segundos" delay="400ms" isSeconds={true} />
          </div>
        ) : (
          <div
            className={`text-center transition-all duration-700 ${
              isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="inline-block p-12 rounded-3xl bg-card border-2 border-primary shadow-gold">
              <h3 className="font-display text-3xl md:text-4xl gold-text-gradient mb-4">
                ¡El Evento ha Comenzado!
              </h3>
              <p className="font-body text-lg text-muted-foreground">
                Esperamos verte allí
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default CountdownSection;

