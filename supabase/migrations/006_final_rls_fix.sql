-- =====================================================
-- SOLUCIÓN DEFINITIVA para políticas RLS
-- Para el proyecto Mia Quince Elegante
-- =====================================================
-- Este script elimina TODAS las políticas existentes
-- y crea políticas correctas que permiten INSERT anónimo
-- =====================================================

-- =====================================================
-- 1. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- =====================================================
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Eliminar políticas de rsvp_groups
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'rsvp_groups'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.rsvp_groups', r.policyname);
        RAISE NOTICE 'Eliminada política: %', r.policyname;
    END LOOP;
    
    -- Eliminar políticas de rsvp_guests
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'rsvp_guests'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.rsvp_guests', r.policyname);
        RAISE NOTICE 'Eliminada política: %', r.policyname;
    END LOOP;
END $$;

-- =====================================================
-- 2. VERIFICAR Y HABILITAR RLS
-- =====================================================
ALTER TABLE public.rsvp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREAR POLÍTICAS PARA rsvp_groups
-- =====================================================

-- INSERT: Permitir a usuarios anónimos y autenticados
CREATE POLICY "anon_insert_rsvp_groups"
    ON public.rsvp_groups
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- SELECT: Solo usuarios autenticados (admin)
CREATE POLICY "authenticated_select_rsvp_groups"
    ON public.rsvp_groups
    FOR SELECT
    TO authenticated
    USING (true);

-- UPDATE: Solo usuarios autenticados (admin)
CREATE POLICY "authenticated_update_rsvp_groups"
    ON public.rsvp_groups
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- DELETE: Solo usuarios autenticados (admin)
CREATE POLICY "authenticated_delete_rsvp_groups"
    ON public.rsvp_groups
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- 4. CREAR POLÍTICAS PARA rsvp_guests
-- =====================================================

-- INSERT: Permitir a usuarios anónimos y autenticados
CREATE POLICY "anon_insert_rsvp_guests"
    ON public.rsvp_guests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- SELECT: Solo usuarios autenticados (admin)
CREATE POLICY "authenticated_select_rsvp_guests"
    ON public.rsvp_guests
    FOR SELECT
    TO authenticated
    USING (true);

-- UPDATE: Solo usuarios autenticados (admin)
CREATE POLICY "authenticated_update_rsvp_guests"
    ON public.rsvp_guests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- DELETE: Solo usuarios autenticados (admin)
CREATE POLICY "authenticated_delete_rsvp_guests"
    ON public.rsvp_guests
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- 5. VERIFICACIÓN FINAL
-- =====================================================
DO $$
DECLARE
    policy_count_groups INTEGER;
    policy_count_guests INTEGER;
    anon_insert_groups BOOLEAN;
    anon_insert_guests BOOLEAN;
BEGIN
    -- Contar políticas
    SELECT COUNT(*) INTO policy_count_groups
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'rsvp_groups';

    SELECT COUNT(*) INTO policy_count_guests
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'rsvp_guests';

    -- Verificar que existe política INSERT para anon en rsvp_groups
    SELECT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' 
        AND tablename = 'rsvp_groups'
        AND policyname = 'anon_insert_rsvp_groups'
        AND roles::text LIKE '%anon%'
        AND cmd = 'INSERT'
    ) INTO anon_insert_groups;

    -- Verificar que existe política INSERT para anon en rsvp_guests
    SELECT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' 
        AND tablename = 'rsvp_guests'
        AND policyname = 'anon_insert_rsvp_guests'
        AND roles::text LIKE '%anon%'
        AND cmd = 'INSERT'
    ) INTO anon_insert_guests;

    -- Mostrar resultados
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICACIÓN DE POLÍTICAS RLS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Políticas rsvp_groups: %', policy_count_groups;
    RAISE NOTICE 'Políticas rsvp_guests: %', policy_count_guests;
    RAISE NOTICE 'Política INSERT anon en rsvp_groups: %', anon_insert_groups;
    RAISE NOTICE 'Política INSERT anon en rsvp_guests: %', anon_insert_guests;
    RAISE NOTICE '========================================';

    -- Validaciones
    IF policy_count_groups < 4 THEN
        RAISE EXCEPTION 'Error: Se esperaban 4 políticas para rsvp_groups, se encontraron %', policy_count_groups;
    END IF;

    IF policy_count_guests < 4 THEN
        RAISE EXCEPTION 'Error: Se esperaban 4 políticas para rsvp_guests, se encontraron %', policy_count_guests;
    END IF;

    IF NOT anon_insert_groups THEN
        RAISE EXCEPTION 'Error: La política de INSERT para anon no existe en rsvp_groups';
    END IF;

    IF NOT anon_insert_guests THEN
        RAISE EXCEPTION 'Error: La política de INSERT para anon no existe en rsvp_guests';
    END IF;

    RAISE NOTICE '✅ TODAS LAS VERIFICACIONES PASARON';
    RAISE NOTICE '✅ Las políticas RLS están correctamente configuradas';
    RAISE NOTICE '✅ Los usuarios anónimos pueden insertar datos';
END $$;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

