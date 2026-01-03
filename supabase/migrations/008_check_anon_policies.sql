-- Verificar que existen las políticas de INSERT para usuarios anónimos
SELECT 
    tablename as "Tabla",
    policyname as "Nombre de Política",
    cmd as "Comando",
    roles as "Roles",
    CASE 
        WHEN roles::text LIKE '%anon%' THEN '✅ Incluye anon'
        ELSE '❌ No incluye anon'
    END as "Permite Anónimos"
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
AND cmd = 'INSERT'
ORDER BY tablename;

