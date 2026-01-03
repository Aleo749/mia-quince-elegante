-- =====================================================
-- LISTA DEFINITIVA DE INVITADOS ORDENADA POR GRUPO
-- Para exportar a Excel
-- =====================================================
-- Este script muestra todos los invitados agrupados
-- con ID secuencial y número de grupo
-- =====================================================

SELECT 
    ROW_NUMBER() OVER (ORDER BY rg.created_at ASC, g.first_name ASC, g.last_name ASC) AS "ID",
    DENSE_RANK() OVER (ORDER BY rg.created_at ASC) AS "Grupo",
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY rg.id ORDER BY g.first_name ASC, g.last_name ASC) = 1 
        THEN rg.phone_number 
        ELSE '' 
    END AS "Teléfono Contacto",
    g.first_name AS "Nombre",
    g.last_name AS "Apellido",
    CASE 
        WHEN g.attending THEN 'Sí'
        ELSE 'No'
    END AS "Asiste",
    TO_CHAR(rg.created_at, 'DD/MM/YYYY') AS "Fecha Registro"
FROM public.rsvp_groups rg
INNER JOIN public.rsvp_guests g ON rg.id = g.group_id
ORDER BY 
    rg.created_at ASC,  -- Ordenar por fecha de creación del grupo
    g.first_name ASC,   -- Luego por nombre dentro del grupo
    g.last_name ASC;    -- Y por apellido

