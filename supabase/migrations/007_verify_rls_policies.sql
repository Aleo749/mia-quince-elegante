-- =====================================================
-- Script de VERIFICACIÓN de políticas RLS
-- Ejecuta este script para verificar que las políticas
-- están correctamente configuradas
-- =====================================================

-- Mostrar todas las políticas existentes
SELECT 
    tablename as "Tabla",
    policyname as "Nombre de Política",
    cmd as "Comando",
    roles as "Roles Permitidos",
    CASE 
        WHEN cmd = 'INSERT' AND roles::text LIKE '%anon%' THEN '✅ Permite INSERT anónimo'
        WHEN cmd = 'INSERT' THEN '❌ No permite INSERT anónimo'
        ELSE '✅'
    END as "Estado"
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
ORDER BY tablename, cmd;

-- Contar políticas por tabla
SELECT 
    tablename as "Tabla",
    COUNT(*) as "Total de Políticas",
    COUNT(CASE WHEN cmd = 'INSERT' AND roles::text LIKE '%anon%' THEN 1 END) as "Políticas INSERT para anon"
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
GROUP BY tablename;

-- Verificar que RLS está habilitado
SELECT 
    tablename as "Tabla",
    rowsecurity as "RLS Habilitado"
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
ORDER BY tablename;

