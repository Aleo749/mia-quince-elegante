import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { UserPlus, Users, Trash2, Send, Check, Sparkles, X, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  attending: boolean;
}

interface RSVPSectionProps {
  rsvpRef: React.RefObject<HTMLElement>;
}

const RSVPSection = ({ rsvpRef }: RSVPSectionProps) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", firstName: "", lastName: "", attending: true }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [addingGuest, setAddingGuest] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  const addGuest = () => {
    setAddingGuest(true);
    setTimeout(() => {
      setGuests([
        ...guests,
        { id: Date.now().toString(), firstName: "", lastName: "", attending: true }
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

  const handleDeclineAttendance = async () => {
    // Validate that all guests have names
    const invalidGuests = guests.filter(g =>
      !g.firstName.trim() ||
      !g.lastName.trim()
    );

    if (invalidGuests.length > 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, completa el nombre y apellido de todos los invitados antes de confirmar que no asistirán.",
        variant: "destructive"
      });
      setShowDeclineDialog(false);
      return;
    }

    // Set all guests to not attending and submit
    const updatedGuests = guests.map(g => ({ ...g, attending: false }));
    setGuests(updatedGuests);
    setShowDeclineDialog(false);

    // Submit with non-attending status
    await submitGuestsToDatabase(updatedGuests);
  };

  // Verificar si el formulario es válido
  const isFormValid = (): boolean => {
    // Verificar que todos los invitados tengan nombre y apellido
    return guests.every(g => {
      const hasName = g.firstName.trim() !== "" && g.lastName.trim() !== "";
      return hasName;
    });
  };

  const submitGuestsToDatabase = async (guestsToSubmit: Guest[]) => {
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

      const guestsToInsert = guestsToSubmit.map(g => ({
        group_id: groupData.id,
        first_name: g.firstName.trim(),
        last_name: g.lastName.trim(),
        attending: g.attending
      }));

      const { error: guestsError } = await supabase
        .from('rsvp_guests')
        .insert(guestsToInsert);

      if (guestsError) {
        console.error('❌ Error al insertar invitados:', guestsError);
        throw guestsError;
      }

      setIsSubmitted(true);
      const attendingCount = guestsToSubmit.filter(g => g.attending).length;
      toast({
        title: attendingCount > 0 ? "¡Confirmación enviada!" : "Confirmación recibida",
        description: attendingCount > 0
          ? "Gracias por confirmar tu asistencia."
          : "Lamentamos que no puedas asistir. ¡Gracias por avisar!",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar invitados
    const invalidGuests = guests.filter(g =>
      !g.firstName.trim() ||
      !g.lastName.trim()
    );

    if (invalidGuests.length > 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, completa el nombre y apellido de todos los invitados.",
        variant: "destructive"
      });
      return;
    }

    await submitGuestsToDatabase(guests);
  };


  if (isSubmitted) {
    return (
      <section
        ref={rsvpRef as React.RefObject<HTMLDivElement>}
        className="relative py-20 px-6"
      >


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
          <Card
            className="relative overflow-hidden border-2 border-primary/20 shadow-soft-lg transition-all duration-500 bg-gradient-to-br from-card via-secondary/20 to-card p-6 sm:p-8"
          >
            {/* Decoración de fondo con sparkles */}
            <div className="absolute top-4 right-4 pointer-events-none">
              <Sparkles className="w-6 h-6 text-primary/20 animate-float" />
            </div>

            <CardContent className="p-0 space-y-8">
              {guests.map((guest, index) => (
                <div key={guest.id} className="space-y-4">
                  {/* Header del invitado */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-primary/30 shadow-gold">
                        <AvatarFallback className="gold-gradient text-primary-foreground font-display text-lg">
                          {guest.firstName ? guest.firstName[0].toUpperCase() : guest.lastName ? guest.lastName[0].toUpperCase() : <User className="w-6 h-6" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="font-display text-2xl text-foreground mb-2">
                          {guest.firstName || guest.lastName
                            ? `${guest.firstName} ${guest.lastName}`.trim()
                            : `Invitado ${index + 1}`
                          }
                        </CardTitle>
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

                  {/* Separador entre invitados (excepto el último) */}
                  {index < guests.length - 1 && (
                    <Separator className="bg-primary/10 my-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Botón simple para agregar invitado */}
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={addGuest}
              disabled={addingGuest}
              className="w-full border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {addingGuest ? 'Agregando...' : 'Agregar otro invitado'}
            </Button>
          </div>


          {/* Botones de acción */}
          <div className="mt-8 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Botón No podré asistir - IZQUIERDA */}
              <Button
                type="button"
                onClick={() => setShowDeclineDialog(true)}
                disabled={isSubmitting || !isFormValid()}
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 disabled:opacity-50 disabled:cursor-not-allowed touch-target-lg rounded-full"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                No podré asistir
              </Button>

              {/* Botón Confirmar Asistencia - DERECHA */}
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="w-full gold-gradient text-primary-foreground font-medium rounded-full shadow-gold hover:shadow-soft-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target-lg focus-visible-ring"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar Asistencia
                  </>
                )}
              </Button>
            </div>

            {!isFormValid() && (
              <p className="text-sm text-center text-muted-foreground">
                Completa todos los campos para habilitar los botones
              </p>
            )}
          </div>

          {/* AlertDialog para confirmación de no asistencia */}
          <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-2xl">
                  ¿Seguro que no podrás asistir?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-body text-base">
                  Lamentamos que no puedas acompañarnos en este día especial.
                  Si confirmas, enviaremos tu respuesta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-body">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeclineAttendance}
                  className="bg-destructive hover:bg-destructive/90 font-body"
                >
                  Confirmar que no asistiré
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    </section>
  );
};

export default RSVPSection;
