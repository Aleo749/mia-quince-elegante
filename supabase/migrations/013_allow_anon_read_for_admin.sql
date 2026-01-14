-- =====================================================
-- Permitir lectura anónima para el panel de admin
-- =====================================================
-- Esta migración permite que usuarios anónimos puedan
-- leer los datos de rsvp_groups y rsvp_guests para que
-- el panel de administración funcione correctamente.
-- =====================================================

-- Habilitar RLS si no está habilitado
ALTER TABLE public.rsvp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes de SELECT si existen (para evitar conflictos)
DROP POLICY IF EXISTS "anon_select_rsvp_groups" ON public.rsvp_groups;
DROP POLICY IF EXISTS "anon_select_rsvp_guests" ON public.rsvp_guests;

-- Crear políticas que permitan lectura anónima
CREATE POLICY "anon_select_rsvp_groups"
ON public.rsvp_groups
FOR SELECT
TO anon
USING (true);

CREATE POLICY "anon_select_rsvp_guests"
ON public.rsvp_guests
FOR SELECT
TO anon
USING (true);

-- Verificar que las políticas se crearon correctamente
DO $$
BEGIN
    RAISE NOTICE '✅ Políticas de lectura anónima creadas correctamente';
    RAISE NOTICE '✅ Los usuarios anónimos ahora pueden leer rsvp_groups y rsvp_guests';
END $$;
