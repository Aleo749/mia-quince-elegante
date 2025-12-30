# Instrucciones para ejecutar el script de migración en Supabase

## Pasos para aplicar la migración

### 1. Acceder al Dashboard de Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto

### 2. Abrir el SQL Editor
1. En el menú lateral izquierdo, haz clic en **SQL Editor**
2. Haz clic en el botón **New query** (Nueva consulta)

### 3. Ejecutar el script de migración
1. Abre el archivo `migration_add_phone.sql` que se encuentra en la carpeta `supabase/`
2. Copia todo el contenido del archivo
3. Pégalo en el editor SQL de Supabase
4. Haz clic en el botón **Run** (Ejecutar) o presiona `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### 4. Verificar la migración
Si todo salió bien, deberías ver un mensaje que dice:
```
NOTICE: Migración exitosa: columna phone_number agregada a rsvp_groups
```

### 5. Verificar la estructura de la tabla
Puedes verificar que la columna se agregó correctamente ejecutando esta consulta:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rsvp_groups';
```

Deberías ver la columna `phone_number` con tipo `character varying` y `is_nullable = YES`.

## ¿Qué hace este script?

El script realiza las siguientes acciones:

1. **Agrega la columna `phone_number`** a la tabla `rsvp_groups`
   - Tipo: VARCHAR(20)
   - Permite valores NULL
   - Almacena el número de teléfono de la persona que recibe la invitación

2. **Agrega un comentario** a la columna para documentación

3. **Crea un índice** para búsquedas rápidas por número de teléfono

4. **Verifica** que la migración se ejecutó correctamente

## Cambios en la aplicación

Después de ejecutar este script, la aplicación ahora:

1. **Muestra un campo de teléfono** en el formulario RSVP (solo para el primer invitado)
2. **Requiere el número de teléfono** para enviar la confirmación
3. **Guarda el teléfono** en la tabla `rsvp_groups` asociado al grupo de invitados

## Estructura de datos

### Tabla `rsvp_groups`
- `id` (UUID) - Identificador único del grupo
- `created_at` (TIMESTAMP) - Fecha de creación
- **`phone_number` (VARCHAR)** - ⭐ **NUEVO**: Teléfono de contacto

### Tabla `rsvp_guests`
- `id` (UUID) - Identificador único del invitado
- `group_id` (UUID) - Referencia al grupo
- `first_name` (VARCHAR) - Nombre del invitado
- `last_name` (VARCHAR) - Apellido del invitado
- `attending` (BOOLEAN) - Si asistirá o no
- `whatsapp_number` (VARCHAR) - Número de WhatsApp (opcional)
- `table_number` (INTEGER) - Número de mesa (opcional)
- `created_at` (TIMESTAMP) - Fecha de creación

## Notas importantes

- El campo `phone_number` se agregó a `rsvp_groups` (no a `rsvp_guests`) porque representa al contacto principal del grupo
- El campo `whatsapp_number` en `rsvp_guests` sigue disponible para números individuales si es necesario
- El formato del teléfono es flexible (puede incluir código de país, espacios, guiones, etc.)

## Solución de problemas

### Error: "relation rsvp_groups does not exist"
Las tablas no existen. Primero debes crear las tablas base ejecutando el script de creación inicial.

### Error: "permission denied"
Verifica que estés usando una cuenta con permisos de administrador en Supabase.

### Error: "column already exists"
La migración ya fue ejecutada anteriormente. No es necesario ejecutarla de nuevo.
