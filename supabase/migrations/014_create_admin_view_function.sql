-- =====================================================
-- Función para obtener invitados agrupados para el admin
-- =====================================================
-- Esta función devuelve todos los invitados con sus grupos
-- sin necesidad de políticas RLS complejas
-- =====================================================

-- Crear una función que devuelva los datos agrupados
CREATE OR REPLACE FUNCTION get_guests_with_groups()
RETURNS TABLE (
  guest_id uuid,
  group_id uuid,
  first_name text,
  last_name text,
  attending boolean,
  table_number integer,
  whatsapp_number character varying,
  group_phone_number character varying,
  created_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id as guest_id,
    g.group_id,
    g.first_name,
    g.last_name,
    g.attending,
    g.table_number,
    g.whatsapp_number,
    rg.phone_number as group_phone_number,
    g.created_at
  FROM public.rsvp_guests g
  INNER JOIN public.rsvp_groups rg ON g.group_id = rg.id
  ORDER BY rg.created_at DESC, g.first_name ASC, g.last_name ASC;
END;
$$;

-- Permitir que usuarios anónimos ejecuten esta función
GRANT EXECUTE ON FUNCTION get_guests_with_groups() TO anon;
GRANT EXECUTE ON FUNCTION get_guests_with_groups() TO authenticated;

-- Verificar que la función se creó correctamente
DO $$
BEGIN
    RAISE NOTICE '✅ Función get_guests_with_groups creada correctamente';
    RAISE NOTICE '✅ Los usuarios anónimos pueden ejecutar esta función';
END $$;
