-- =====================================================
-- DIAGNÓSTICO COMPLETO DE POLÍTICAS RLS
-- =====================================================

-- 1. Ver TODAS las políticas existentes
SELECT 
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
ORDER BY tablename, cmd;

-- 2. Verificar si existen políticas específicas para anon
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
AND cmd = 'INSERT'
AND roles::text LIKE '%anon%';

-- 3. Contar políticas por tabla y comando
SELECT 
    tablename,
    cmd,
    COUNT(*) as count,
    STRING_AGG(policyname, ', ') as policy_names
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
GROUP BY tablename, cmd
ORDER BY tablename, cmd;

-- 4. Verificar RLS está habilitado
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests');

