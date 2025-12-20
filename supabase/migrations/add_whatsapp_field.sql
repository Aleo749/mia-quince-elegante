-- Agregar campo de WhatsApp a la tabla rsvp_guests (cada invitado tiene su número)
ALTER TABLE public.rsvp_guests 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Agregar comentario al campo para documentación
COMMENT ON COLUMN public.rsvp_guests.whatsapp_number IS 'Número de WhatsApp del invitado (formato: 261XXXXXXX)';

