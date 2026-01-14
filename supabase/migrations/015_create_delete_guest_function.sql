-- Función para eliminar un invitado
-- Esta función permite eliminar invitados incluso cuando hay problemas con RLS o permisos
CREATE OR REPLACE FUNCTION delete_guest(guest_id_to_delete uuid)
RETURNS TABLE (
  deleted_id uuid,
  deleted_first_name text,
  deleted_last_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_record record;
BEGIN
  -- Obtener los datos del invitado antes de eliminarlo
  SELECT id, first_name, last_name INTO deleted_record
  FROM public.rsvp_guests
  WHERE id = guest_id_to_delete;

  -- Si no existe, retornar vacío
  IF deleted_record IS NULL THEN
    RETURN;
  END IF;

  -- Eliminar el invitado
  DELETE FROM public.rsvp_guests
  WHERE id = guest_id_to_delete;

  -- Retornar los datos del invitado eliminado
  RETURN QUERY SELECT 
    deleted_record.id,
    deleted_record.first_name,
    deleted_record.last_name;
END;
$$;

-- Otorgar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION delete_guest(uuid) TO anon;
GRANT EXECUTE ON FUNCTION delete_guest(uuid) TO authenticated;
