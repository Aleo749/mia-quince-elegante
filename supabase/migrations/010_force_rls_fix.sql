-- =====================================================
-- SOLUCIÓN FORZADA - Elimina TODO y recrea
-- =====================================================
-- Esta solución es más agresiva y garantiza que funcione
-- =====================================================

-- PASO 1: ELIMINAR ABSOLUTAMENTE TODAS LAS POLÍTICAS
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Eliminar TODAS las políticas de rsvp_groups
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'rsvp_groups'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.rsvp_groups CASCADE', r.policyname);
    END LOOP;
    
    -- Eliminar TODAS las políticas de rsvp_guests
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'rsvp_guests'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.rsvp_guests CASCADE', r.policyname);
    END LOOP;
    
    RAISE NOTICE 'Todas las políticas eliminadas';
END $$;

-- PASO 2: Asegurar que RLS está habilitado
ALTER TABLE public.rsvp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;

-- PASO 3: Crear políticas SEPARADAS para anon y authenticated
-- (A veces Supabase funciona mejor con políticas separadas)

-- rsvp_groups - INSERT para anon
CREATE POLICY "anon_can_insert_groups"
    ON public.rsvp_groups
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- rsvp_groups - INSERT para authenticated  
CREATE POLICY "auth_can_insert_groups"
    ON public.rsvp_groups
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- rsvp_groups - SELECT para authenticated
CREATE POLICY "auth_can_select_groups"
    ON public.rsvp_groups
    FOR SELECT
    TO authenticated
    USING (true);

-- rsvp_groups - UPDATE para authenticated
CREATE POLICY "auth_can_update_groups"
    ON public.rsvp_groups
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- rsvp_groups - DELETE para authenticated
CREATE POLICY "auth_can_delete_groups"
    ON public.rsvp_groups
    FOR DELETE
    TO authenticated
    USING (true);

-- rsvp_guests - INSERT para anon
CREATE POLICY "anon_can_insert_guests"
    ON public.rsvp_guests
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- rsvp_guests - INSERT para authenticated
CREATE POLICY "auth_can_insert_guests"
    ON public.rsvp_guests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- rsvp_guests - SELECT para authenticated
CREATE POLICY "auth_can_select_guests"
    ON public.rsvp_guests
    FOR SELECT
    TO authenticated
    USING (true);

-- rsvp_guests - UPDATE para authenticated
CREATE POLICY "auth_can_update_guests"
    ON public.rsvp_guests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- rsvp_guests - DELETE para authenticated
CREATE POLICY "auth_can_delete_guests"
    ON public.rsvp_guests
    FOR DELETE
    TO authenticated
    USING (true);

-- PASO 4: Verificación final
DO $$
DECLARE
    anon_groups_count INTEGER;
    anon_guests_count INTEGER;
BEGIN
    -- Contar políticas INSERT para anon en rsvp_groups
    SELECT COUNT(*) INTO anon_groups_count
    FROM pg_policies
    WHERE schemaname = 'public' 
    AND tablename = 'rsvp_groups'
    AND cmd = 'INSERT'
    AND roles::text LIKE '%anon%';
    
    -- Contar políticas INSERT para anon en rsvp_guests
    SELECT COUNT(*) INTO anon_guests_count
    FROM pg_policies
    WHERE schemaname = 'public' 
    AND tablename = 'rsvp_guests'
    AND cmd = 'INSERT'
    AND roles::text LIKE '%anon%';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RESULTADO:';
    RAISE NOTICE 'Políticas INSERT anon en rsvp_groups: %', anon_groups_count;
    RAISE NOTICE 'Políticas INSERT anon en rsvp_guests: %', anon_guests_count;
    RAISE NOTICE '========================================';
    
    IF anon_groups_count = 0 THEN
        RAISE EXCEPTION 'ERROR: No se creó la política INSERT anon para rsvp_groups';
    END IF;
    
    IF anon_guests_count = 0 THEN
        RAISE EXCEPTION 'ERROR: No se creó la política INSERT anon para rsvp_guests';
    END IF;
    
    RAISE NOTICE '✅ Políticas creadas correctamente';
END $$;

