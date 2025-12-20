import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { UserPlus, Users, Trash2, Send, Check, Phone, Sparkles, Heart, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SectionBadge from "@/components/common/SectionBadge";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  attending: boolean;
  whatsappNumber: string;
}

interface RSVPSectionProps {
  rsvpRef: React.RefObject<HTMLElement>;
}

const RSVPSection = ({ rsvpRef }: RSVPSectionProps) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", firstName: "", lastName: "", attending: true, whatsappNumber: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [addingGuest, setAddingGuest] = useState(false);

  const addGuest = () => {
    setAddingGuest(true);
    setTimeout(() => {
      setGuests([
        ...guests,
        { id: Date.now().toString(), firstName: "", lastName: "", attending: true, whatsappNumber: "" }
      ]);
      setAddingGuest(false);
    }, 300);
  };

  const removeGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter(g => g.id !== id));
    }
  };

  const updateGuest = (id: string, field: keyof Guest, value: string | boolean) => {
    setGuests(guests.map(g =>
      g.id === id ? { ...g, [field]: value } : g
    ));
  };

  // Validar número de WhatsApp (solo muestra errores cuando hay contenido mal formateado)
  const validateWhatsApp = (value: string): string => {
    // Si está vacío, no mostrar error (el campo es obligatorio pero no mostramos "Campo requerido")
    if (value.length === 0) {
      return "";
    }

    // Solo números enteros (no negativos)
    if (!/^\d+$/.test(value)) {
      return "Solo se permiten números";
    }

    if (value.length < 8) {
      return "El número debe tener al menos 8 dígitos";
    }

    if (value.length > 12) {
      return "El número no puede tener más de 12 dígitos";
    }

    return "";
  };

  const handleWhatsAppChange = (id: string, value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, "");
    updateGuest(id, "whatsappNumber", numericValue);
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    // Verificar que todos los invitados tengan nombre, apellido y WhatsApp válido
    return guests.every(g => {
      const hasName = g.firstName.trim() !== "" && g.lastName.trim() !== "";
      const whatsappValid = g.whatsappNumber.length >= 8 &&
        g.whatsappNumber.length <= 12 &&
        /^\d+$/.test(g.whatsappNumber);
      return hasName && whatsappValid;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar invitados
    const invalidGuests = guests.filter(g =>
      !g.firstName.trim() ||
      !g.lastName.trim() ||
      !g.whatsappNumber ||
      g.whatsappNumber.length < 8 ||
      g.whatsappNumber.length > 12 ||
      !/^\d+$/.test(g.whatsappNumber)
    );

    if (invalidGuests.length > 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, completa el nombre, apellido y número de celular válido (sin 0 y sin 15, 8-12 dígitos) de todos los invitados.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Log de depuración (solo en desarrollo)
      if (import.meta.env.DEV) {
        console.log('🔍 Intentando conectar con Supabase...');
        console.log('URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ Faltante');
        console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Configurada' : '❌ Faltante');
      }

      const { data: groupData, error: groupError } = await supabase
        .from('rsvp_groups')
        .insert({})
        .select()
        .single();

      if (groupError) {
        console.error('❌ Error al crear grupo RSVP:', groupError);
        throw groupError;
      }

      if (!groupData || !groupData.id) {
        throw new Error('No se recibió un ID de grupo válido');
      }

      const guestsToInsert = guests.map(g => ({
        group_id: groupData.id,
        first_name: g.firstName.trim(),
        last_name: g.lastName.trim(),
        attending: g.attending,
        whatsapp_number: g.whatsappNumber
      }));

      const { error: guestsError } = await supabase
        .from('rsvp_guests')
        .insert(guestsToInsert);

      if (guestsError) {
        console.error('❌ Error al insertar invitados:', guestsError);
        throw guestsError;
      }

      setIsSubmitted(true);
      toast({
        title: "¡Confirmación enviada!",
        description: "Gracias por confirmar tu asistencia.",
      });
    } catch (error: any) {
      console.error("❌ Error completo al enviar RSVP:", error);
      console.error("Detalles del error:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        statusCode: error?.statusCode
      });

      // Verificar si el error es por configuración faltante
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
        toast({
          title: "Error de configuración",
          description: "Las credenciales de Supabase no están configuradas. Por favor, configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en un archivo .env.local",
          variant: "destructive"
        });
      } else if (error?.message?.includes('JWT') || error?.message?.includes('Invalid API key') || error?.code === 'PGRST301') {
        toast({
          title: "Error de autenticación",
          description: "Las credenciales de Supabase son incorrectas. Por favor, verifica tus variables de entorno en el archivo .env",
          variant: "destructive"
        });
      } else if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
        toast({
          title: "Error de base de datos",
          description: "Las tablas no existen en Supabase. Por favor, ejecuta las migraciones desde el SQL Editor en tu dashboard de Supabase.",
          variant: "destructive"
        });
      } else if (error?.code === '42501' || error?.message?.includes('permission denied')) {
        toast({
          title: "Error de permisos",
          description: "No tienes permisos para insertar datos. Verifica las políticas RLS (Row Level Security) en Supabase.",
          variant: "destructive"
        });
      } else {
        const errorMessage = error?.message || error?.details || "Hubo un problema al enviar tu confirmación. Por favor, intenta de nuevo.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSubmitted) {
    return (
      <section
        ref={rsvpRef as React.RefObject<HTMLDivElement>}
        className="relative py-20 px-6"
      >
        {/* Section Number */}
        <SectionBadge number="05" />

        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 animate-scale-in shadow-gold">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            ¡Gracias!
          </h2>
          <p className="font-body text-foreground/80">
            Tu confirmación ha sido registrada. ¡Nos vemos en la fiesta!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (rsvpRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative section-padding-y section-padding"
    >
      {/* Section Number */}
      <SectionBadge number="05" />

      <div className="max-w-2xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-14 h-14 rounded-full bg-card shadow-soft flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Confirmar Asistencia
          </h2>
          <div className="w-24 h-px gold-gradient mx-auto mb-4 rounded-full" />
          <p className="font-body text-muted-foreground">
            Por favor, confirma tu asistencia antes del 1 de Marzo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="space-y-6">
            {guests.map((guest, index) => (
              <Card
                key={guest.id}
                className="group relative overflow-hidden border-2 border-primary/20 shadow-soft-lg hover:shadow-soft-xl transition-all duration-500 hover:border-primary/40 bg-gradient-to-br from-card via-secondary/20 to-card p-6 sm:p-8"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Decoración de fondo con sparkles */}
                <div className="absolute top-4 right-4 pointer-events-none">
                  <Sparkles className="w-6 h-6 text-primary/20 animate-float" style={{ animationDelay: `${index * 0.3}s` }} />
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-primary/30 shadow-gold">
                        <AvatarFallback className="gold-gradient text-primary-foreground font-display text-lg">
                          {guest.firstName ? guest.firstName[0].toUpperCase() : guest.lastName ? guest.lastName[0].toUpperCase() : <User className="w-6 h-6" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="font-display text-2xl text-foreground">
                            {guest.firstName || guest.lastName
                              ? `${guest.firstName} ${guest.lastName}`.trim()
                              : `Invitado ${index + 1}`
                            }
                          </CardTitle>
                          {guest.attending ? (
                            <Badge variant="default" className="gold-gradient text-primary-foreground border-0 shadow-gold">
                              <Heart className="w-3 h-3 mr-1 fill-current" />
                              Asiste
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground bg-secondary/50">
                              <span className="mr-1">😢</span>
                              No Asiste
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="font-body">
                          {guest.firstName || guest.lastName
                            ? 'Completa los datos del invitado'
                            : 'Nuevo invitado - Completa los datos'
                          }
                        </CardDescription>
                      </div>
                    </div>
                    {guests.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGuest(guest.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full w-9 h-9 p-0 transition-all duration-300 hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <Separator className="bg-primary/10" />

                <CardContent className="pt-6 space-y-5">

                  {/* Campos de nombre y apellido */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`firstName-${guest.id}`} className="text-foreground font-body text-sm font-medium">
                        Nombre
                      </Label>
                      <div className="relative">
                        <Input
                          id={`firstName-${guest.id}`}
                          value={guest.firstName}
                          onChange={(e) => updateGuest(guest.id, "firstName", e.target.value)}
                          placeholder="Ingresa el nombre"
                          className="h-12 md:h-11 border-2 transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus-visible-ring"
                        />
                        {guest.firstName && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lastName-${guest.id}`} className="text-foreground font-body text-sm font-medium">
                        Apellido
                      </Label>
                      <div className="relative">
                        <Input
                          id={`lastName-${guest.id}`}
                          value={guest.lastName}
                          onChange={(e) => updateGuest(guest.id, "lastName", e.target.value)}
                          placeholder="Ingresa el apellido"
                          className="h-12 md:h-11 border-2 transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus-visible-ring"
                        />
                        {guest.lastName && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Campo de WhatsApp */}
                  <div className="space-y-2">
                    <Label htmlFor={`whatsapp-${guest.id}`} className="text-foreground font-body text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Celular (sin 0 y sin 15)
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={`whatsapp-${guest.id}`}
                        type="text"
                        inputMode="numeric"
                        value={guest.whatsappNumber}
                        onChange={(e) => handleWhatsAppChange(guest.id, e.target.value)}
                        placeholder="2617216100"
                        maxLength={12}
                        required
                        className={`h-12 md:h-11 border-2 pl-4 pr-12 transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus-visible-ring ${validateWhatsApp(guest.whatsappNumber) ? 'border-destructive/50' : ''
                          }`}
                      />
                      {!validateWhatsApp(guest.whatsappNumber) && guest.whatsappNumber.length >= 8 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                        </div>
                      )}
                    </div>
                    {validateWhatsApp(guest.whatsappNumber) && (
                      <p className="text-xs text-destructive flex items-center gap-1.5">
                        <X className="w-3 h-3" />
                        {validateWhatsApp(guest.whatsappNumber)}
                      </p>
                    )}
                    {!validateWhatsApp(guest.whatsappNumber) && guest.whatsappNumber.length > 0 && guest.whatsappNumber.length < 8 && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Ingresa {8 - guest.whatsappNumber.length} dígito(s) más
                      </p>
                    )}
                    {!validateWhatsApp(guest.whatsappNumber) && guest.whatsappNumber.length >= 8 && guest.whatsappNumber.length < 12 && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Número válido. Puedes agregar hasta {12 - guest.whatsappNumber.length} dígito(s) más
                      </p>
                    )}
                    {!validateWhatsApp(guest.whatsappNumber) && guest.whatsappNumber.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Ejemplo: 2617216100 (sin 0 y sin 15, 8-12 dígitos)
                      </p>
                    )}
                  </div>

                </CardContent>

                <Separator className="bg-primary/10" />

                <CardFooter className="flex items-center justify-between pt-6">
                  <div className="flex items-center gap-3">
                    <Heart className={`w-5 h-5 transition-all duration-300 ${guest.attending ? 'text-primary fill-primary' : 'text-muted-foreground'
                      }`} />
                    <Label htmlFor={`attending-${guest.id}`} className="text-foreground font-body font-medium cursor-pointer">
                      ¿Asistirás a la celebración?
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-body transition-all duration-300 ${!guest.attending ? 'text-primary font-semibold' : 'text-muted-foreground'
                      }`}>
                      No
                    </span>
                    <Switch
                      id={`attending-${guest.id}`}
                      checked={guest.attending}
                      onCheckedChange={(checked) => updateGuest(guest.id, "attending", checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <span className={`text-sm font-body transition-all duration-300 ${guest.attending ? 'text-primary font-semibold' : 'text-muted-foreground'
                      }`}>
                      Sí
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Botón para agregar invitado */}
          <Card className="mt-6 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer bg-secondary/30" onClick={addGuest}>
            <CardContent className="flex items-center justify-center py-8">
              <Button
                type="button"
                variant="ghost"
                onClick={addGuest}
                disabled={addingGuest}
                className="group h-auto p-0 hover:bg-transparent"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-full gold-gradient flex items-center justify-center shadow-gold transition-all duration-300 ${addingGuest ? 'animate-spin' : 'group-hover:scale-110 group-hover:rotate-90'
                    }`}>
                    {addingGuest ? (
                      <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    ) : (
                      <UserPlus className="w-8 h-8 text-primary-foreground" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg text-foreground">
                      {addingGuest ? 'Agregando invitado...' : 'Agregar otro invitado'}
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Haz clic para agregar más invitados
                    </p>
                  </div>
                  {!addingGuest && (
                    <Sparkles className="w-5 h-5 text-primary animate-float" />
                  )}
                </div>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full gold-gradient text-primary-foreground font-medium rounded-full shadow-gold hover:shadow-soft-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target-lg focus-visible-ring"
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
            {!isFormValid() && (
              <p className="mt-2 text-sm text-center text-muted-foreground">
                Completa todos los campos para habilitar el botón
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default RSVPSection;
