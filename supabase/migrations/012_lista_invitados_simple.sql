-- =====================================================
-- LISTA SIMPLE DE INVITADOS (VERSIÓN ALTERNATIVA)
-- Para exportar a Excel - Formato más simple
-- =====================================================

SELECT 
    g.first_name AS "Nombre",
    g.last_name AS "Apellido",
    rg.phone_number AS "Teléfono Contacto",
    CASE 
        WHEN g.attending THEN 'Sí'
        ELSE 'No'
    END AS "Asiste",
    TO_CHAR(rg.created_at, 'DD/MM/YYYY') AS "Fecha Registro"
FROM public.rsvp_groups rg
INNER JOIN public.rsvp_guests g ON rg.id = g.group_id
ORDER BY 
    rg.phone_number,
    g.first_name,
    g.last_name;

