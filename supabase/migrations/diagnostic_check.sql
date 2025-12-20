-- Script de diagnóstico para verificar el estado de la base de datos
-- Ejecuta este script en el SQL Editor de Supabase para ver qué está pasando

-- 1. Verificar si las tablas existen
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('rsvp_groups', 'rsvp_guests')
ORDER BY table_name;

-- 2. Verificar la estructura de las tablas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'rsvp_groups'
ORDER BY ordinal_position;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'rsvp_guests'
ORDER BY ordinal_position;

-- 3. Verificar si RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
    AND tablename IN ('rsvp_groups', 'rsvp_guests');

-- 4. Verificar las políticas RLS existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' 
    AND tablename IN ('rsvp_groups', 'rsvp_guests')
ORDER BY tablename, policyname;

-- 5. Verificar si hay datos de prueba (opcional, solo para verificar)
SELECT COUNT(*) as total_groups FROM public.rsvp_groups;
SELECT COUNT(*) as total_guests FROM public.rsvp_guests;

