import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { UserPlus, Users, Trash2, Send, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

  const addGuest = () => {
    setGuests([
      ...guests,
      { id: Date.now().toString(), firstName: "", lastName: "", attending: true }
    ]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const invalidGuests = guests.filter(g => !g.firstName.trim() || !g.lastName.trim());
    if (invalidGuests.length > 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, completa el nombre y apellido de todos los invitados.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('rsvp_groups')
        .insert({})
        .select()
        .single();

      if (groupError) throw groupError;

      const guestsToInsert = guests.map(g => ({
        group_id: groupData.id,
        first_name: g.firstName.trim(),
        last_name: g.lastName.trim(),
        attending: g.attending
      }));

      const { error: guestsError } = await supabase
        .from('rsvp_guests')
        .insert(guestsToInsert);

      if (guestsError) throw guestsError;

      setIsSubmitted(true);
      toast({
        title: "¡Confirmación enviada!",
        description: "Gracias por confirmar tu asistencia.",
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu confirmación. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const guestNames = guests
      .map(g => `${g.firstName} ${g.lastName} - ${g.attending ? "Asiste" : "No asiste"}`)
      .join("%0A");
    const message = `Hola! Confirmo asistencia a los XV de Mia Valentina:%0A%0A${guestNames}`;
    window.open(`https://wa.me/5491112345678?text=${message}`, "_blank");
  };

  if (isSubmitted) {
    return (
      <section 
        ref={rsvpRef as React.RefObject<HTMLDivElement>}
        className="relative py-20 px-6"
      >
        {/* Section Number */}
        <span className="section-number">05</span>

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
      className="relative py-20 px-6"
    >
      {/* Section Number */}
      <span className="section-number">05</span>

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
          className={`bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft-lg transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="space-y-6">
            {guests.map((guest, index) => (
              <div 
                key={guest.id}
                className="p-5 rounded-2xl bg-secondary/50 border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-muted-foreground">
                    Invitado {index + 1}
                  </span>
                  {guests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuest(guest.id)}
                      className="text-destructive hover:text-destructive/80 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`firstName-${guest.id}`} className="text-foreground">
                      Nombre
                    </Label>
                    <Input
                      id={`firstName-${guest.id}`}
                      value={guest.firstName}
                      onChange={(e) => updateGuest(guest.id, "firstName", e.target.value)}
                      placeholder="Nombre"
                      className="mt-1 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lastName-${guest.id}`} className="text-foreground">
                      Apellido
                    </Label>
                    <Input
                      id={`lastName-${guest.id}`}
                      value={guest.lastName}
                      onChange={(e) => updateGuest(guest.id, "lastName", e.target.value)}
                      placeholder="Apellido"
                      className="mt-1 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor={`attending-${guest.id}`} className="text-foreground">
                    ¿Asistirás?
                  </Label>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${!guest.attending ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      No
                    </span>
                    <Switch
                      id={`attending-${guest.id}`}
                      checked={guest.attending}
                      onCheckedChange={(checked) => updateGuest(guest.id, "attending", checked)}
                    />
                    <span className={`text-sm ${guest.attending ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      Sí
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addGuest}
            className="w-full mt-6 border-primary/30 text-primary hover:bg-primary/5 rounded-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar otro invitado
          </Button>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gold-gradient text-primary-foreground font-medium rounded-full shadow-gold hover:shadow-soft-lg transition-all"
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
            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1 border-green-500/30 text-green-600 hover:bg-green-500/5 rounded-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Por WhatsApp
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RSVPSection;
