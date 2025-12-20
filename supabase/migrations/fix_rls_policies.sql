-- Script para corregir las políticas RLS y permitir inserciones anónimas
-- Ejecuta este script en el SQL Editor de Supabase

-- Eliminar políticas existentes si existen (para evitar duplicados)
DROP POLICY IF EXISTS "Anyone can create rsvp groups" ON public.rsvp_groups;
DROP POLICY IF EXISTS "Anyone can create guests" ON public.rsvp_guests;
DROP POLICY IF EXISTS "Authenticated users can view all groups" ON public.rsvp_groups;
DROP POLICY IF EXISTS "Authenticated users can view all guests" ON public.rsvp_guests;
DROP POLICY IF EXISTS "Authenticated users can update guests" ON public.rsvp_guests;
DROP POLICY IF EXISTS "Authenticated users can delete groups" ON public.rsvp_groups;
DROP POLICY IF EXISTS "Authenticated users can delete guests" ON public.rsvp_guests;

-- Asegurar que RLS esté habilitado
ALTER TABLE public.rsvp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;

-- Crear políticas para INSERT (cualquiera puede insertar, incluyendo usuarios anónimos)
CREATE POLICY "Public can create rsvp groups" 
ON public.rsvp_groups 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Public can create guests" 
ON public.rsvp_guests 
FOR INSERT 
TO public
WITH CHECK (true);

-- Crear políticas para SELECT (solo usuarios autenticados pueden leer)
CREATE POLICY "Authenticated users can view all groups" 
ON public.rsvp_groups 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view all guests" 
ON public.rsvp_guests 
FOR SELECT 
TO authenticated
USING (true);

-- Crear políticas para UPDATE (solo usuarios autenticados pueden actualizar)
CREATE POLICY "Authenticated users can update guests" 
ON public.rsvp_guests 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Crear políticas para DELETE (solo usuarios autenticados pueden eliminar)
CREATE POLICY "Authenticated users can delete groups" 
ON public.rsvp_groups 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete guests" 
ON public.rsvp_guests 
FOR DELETE 
TO authenticated
USING (true);

