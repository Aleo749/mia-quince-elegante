-- =====================================================
-- Script de migración para agregar campo de teléfono
-- =====================================================
-- Este script modifica las tablas de RSVP para registrar
-- el número de teléfono de la persona que recibe la invitación
-- =====================================================

-- 1. Agregar columna de teléfono a la tabla rsvp_groups
-- Esta columna almacenará el teléfono de la persona que recibe la invitación
ALTER TABLE rsvp_groups 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- 2. Agregar comentario a la columna para documentación
COMMENT ON COLUMN rsvp_groups.phone_number IS 'Número de teléfono de la persona que recibe la invitación y responde por el grupo';

-- 3. Opcional: Agregar índice para búsquedas rápidas por teléfono
CREATE INDEX IF NOT EXISTS idx_rsvp_groups_phone_number 
ON rsvp_groups(phone_number);

-- =====================================================
-- Notas importantes:
-- =====================================================
-- - El campo phone_number se agrega a rsvp_groups (no a rsvp_guests)
--   porque representa al contacto principal del grupo
-- - El campo whatsapp_number en rsvp_guests ya existe y puede seguir
--   usándose para números individuales de WhatsApp si es necesario
-- - El campo es VARCHAR(20) para soportar diferentes formatos
--   internacionales (ej: +56912345678, +1234567890, etc.)
-- =====================================================

-- Verificar que la migración se ejecutó correctamente
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'rsvp_groups' 
    AND column_name = 'phone_number'
  ) THEN
    RAISE NOTICE 'Migración exitosa: columna phone_number agregada a rsvp_groups';
  ELSE
    RAISE EXCEPTION 'Error: la columna phone_number no fue agregada correctamente';
  END IF;
END $$;
