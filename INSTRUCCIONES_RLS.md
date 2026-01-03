# 🔧 Instrucciones para Arreglar el Error de Permisos RLS

## Problema
Los invitados reciben el error: **"Error de permisos - No tienes permisos para insertar datos"** al intentar confirmar su asistencia.

## Solución

Necesitas aplicar la migración de SQL en tu proyecto de Supabase. Sigue estos pasos:

### Paso 1: Abrir el SQL Editor en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**
4. Haz clic en el botón **New query**

### Paso 2: Copiar y Ejecutar la Migración

1. Abre el archivo `supabase/migrations/006_final_rls_fix.sql` en tu editor
2. Copia **TODO el contenido** del archivo
3. Pega el contenido en el SQL Editor de Supabase
4. Haz clic en el botón **RUN** (o presiona Ctrl+Enter / Cmd+Enter)

### Paso 3: Verificar que Funcionó

Deberías ver mensajes como:
```
✅ TODAS LAS VERIFICACIONES PASARON
✅ Las políticas RLS están correctamente configuradas
✅ Los usuarios anónimos pueden insertar datos
```

Si ves errores, cópialos y revisa el problema.

### Paso 4: Probar el Formulario

1. Ve a tu sitio web de invitación
2. Intenta llenar el formulario RSVP
3. Deberías poder enviarlo sin el error de permisos

## ¿Qué hace esta migración?

Esta migración:
- ✅ Elimina todas las políticas RLS existentes (para evitar conflictos)
- ✅ Crea nuevas políticas que permiten a usuarios **anónimos** insertar datos
- ✅ Mantiene la seguridad: solo usuarios autenticados (admin) pueden leer/editar/eliminar
- ✅ Verifica que todo se configuró correctamente

## Si Aún No Funciona

1. **Verifica que ejecutaste la migración correctamente**
   - Asegúrate de copiar TODO el contenido del archivo SQL
   - Verifica que no hay errores en el SQL Editor

2. **Revisa las políticas en Supabase**
   - Ve a **Authentication** → **Policies** en tu dashboard
   - Verifica que existen las políticas:
     - `anon_insert_rsvp_groups`
     - `anon_insert_rsvp_guests`

3. **Revisa la consola del navegador**
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña **Console**
   - Busca errores relacionados con Supabase

4. **Verifica las variables de entorno**
   - Asegúrate de que `.env.local` tiene las credenciales correctas
   - Reinicia el servidor de desarrollo después de cambiar `.env.local`

