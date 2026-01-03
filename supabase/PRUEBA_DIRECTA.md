# 🧪 Prueba Directa de las Políticas RLS

Si el error persiste, vamos a probar directamente en Supabase si las políticas funcionan.

## Paso 1: Probar Inserción Directa en SQL Editor

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Crea una nueva query
3. Ejecuta este código:

```sql
-- Probar inserción como usuario anónimo
SET ROLE anon;

-- Intentar insertar un grupo
INSERT INTO public.rsvp_groups (phone_number) 
VALUES ('+56912345678') 
RETURNING *;

-- Limpiar (eliminar el registro de prueba)
DELETE FROM public.rsvp_groups WHERE phone_number = '+56912345678';

-- Volver al rol normal
RESET ROLE;
```

### Resultados Posibles:

- ✅ **Si funciona**: Las políticas están bien, el problema está en el cliente
- ❌ **Si falla**: Las políticas tienen un problema

## Paso 2: Verificar el Rol Actual

Ejecuta esto en el SQL Editor:

```sql
-- Ver el rol actual
SELECT current_user, session_user;

-- Ver todas las políticas activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('rsvp_groups', 'rsvp_guests')
ORDER BY tablename, cmd;
```

## Paso 3: Verificar la Clave API en el Código

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Verificar qué clave está usando
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key (primeros 50 chars):', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 50));

// Verificar el cliente de Supabase
import { supabase } from '@/integrations/supabase/client';
console.log('Supabase client:', supabase);
```

## Paso 4: Probar con una Función de Prueba

Crea esta función en Supabase SQL Editor:

```sql
-- Función para probar inserción
CREATE OR REPLACE FUNCTION test_insert_rsvp_group(phone TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.rsvp_groups (phone_number)
    VALUES (phone)
    RETURNING id INTO new_id;
    RETURN new_id;
END;
$$;

-- Probar la función
SELECT test_insert_rsvp_group('+56912345678');
```

Si esta función funciona, podemos usarla como alternativa temporal.

## Paso 5: Verificar Configuración de Supabase

1. Ve a **Settings** → **API**
2. Verifica que:
   - La **anon key** está visible
   - No hay restricciones de CORS que bloqueen las peticiones
   - El proyecto está activo (no pausado)

3. Ve a **Settings** → **Database**
4. Verifica que:
   - RLS está habilitado globalmente
   - No hay políticas de seguridad adicionales

## Paso 6: Alternativa Temporal - Deshabilitar RLS (NO RECOMENDADO)

⚠️ **SOLO PARA PRUEBAS**: Si necesitas que funcione inmediatamente, puedes deshabilitar RLS temporalmente:

```sql
-- ⚠️ SOLO PARA PRUEBAS - NO USAR EN PRODUCCIÓN
ALTER TABLE public.rsvp_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests DISABLE ROW LEVEL SECURITY;
```

**PERO** esto es **INSEGURO** y solo debería usarse para verificar que el problema es RLS.

## ¿Qué Hacer Según el Resultado?

### Si la prueba directa en SQL funciona:
- El problema está en el cliente (código JavaScript)
- Verifica la clave API en `.env.local`
- Verifica que estás usando la clave **anon**, no service_role

### Si la prueba directa en SQL falla:
- El problema está en las políticas
- Ejecuta el script `005_fix_rls_alternative.sql`
- O contacta el soporte de Supabase

### Si nada funciona:
- Crea un nuevo proyecto de Supabase
- Ejecuta los scripts desde cero
- A veces es más rápido empezar de nuevo

