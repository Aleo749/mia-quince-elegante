# Mia Quince Elegante 💎

Una invitación digital elegante y moderna para la celebración de quinceañera, desarrollada con React, TypeScript y Supabase.

## 📋 Descripción

Sitio web de invitación interactivo para quinceañera que incluye:

- **Sección Hero** con presentación animada y reproductor de música
- **Mensaje personal** de la cumpleañera
- **Galería de fotos** interactiva
- **Detalles del evento** (fecha, hora, lugar)
- **Código de vestimenta**
- **Sistema RSVP** para confirmación de asistencia
- **Registro de regalos**
- **Información de contacto**
- **Panel de administración** para gestionar invitados y respuestas

## 🎉 Detalles del Evento

- **Fecha**: 15 de Marzo, 2025 (Sábado)
- **Hora**: 20:00 hs
- **Lugar**: Salón Royal Palace
- **Dirección**: Av. Principal 1234

## 🚀 Tecnologías Utilizadas

- **Vite** - Build tool y dev server
- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **React Router** - Enrutamiento
- **Supabase** - Backend y base de datos
- **TanStack Query** - Gestión de estado del servidor
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilos
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o bun
- Cuenta de Supabase (para la base de datos)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <TU_URL_GIT>
cd mia-quince-elegante

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local en la raíz del proyecto con tus credenciales de Supabase
# Puedes encontrar estas credenciales en: https://app.supabase.com/project/_/settings/api
# VITE_SUPABASE_URL=tu_url_supabase
# VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_anonima

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con hot-reload
- `npm run build` - Construye la aplicación para producción
- `npm run build:dev` - Construye la aplicación en modo desarrollo
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🗂️ Estructura del Proyecto

```
mia-quince-elegante/
├── src/
│   ├── components/
│   │   ├── invitation/      # Componentes de la invitación
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MessageSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── EventDetailsSection.tsx
│   │   │   ├── DressCodeSection.tsx
│   │   │   ├── RSVPSection.tsx
│   │   │   ├── GiftRegistrySection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/              # Componentes de shadcn/ui
│   ├── pages/               # Páginas principales
│   │   ├── Index.tsx        # Página principal (invitación)
│   │   ├── Admin.tsx        # Panel de administración
│   │   ├── Auth.tsx         # Autenticación
│   │   └── NotFound.tsx     # Página 404
│   ├── hooks/               # Custom hooks
│   ├── integrations/        # Integraciones externas
│   │   └── supabase/        # Cliente y tipos de Supabase
│   └── lib/                 # Utilidades
├── supabase/
│   └── migrations/          # Migraciones de base de datos
└── public/                  # Archivos estáticos
```

## 🎨 Características Principales

### ✨ Diseño Elegante
- Animaciones suaves y transiciones
- Gradientes dorados temáticos
- Diseño responsive para todos los dispositivos
- Tipografía elegante y legible

### 📸 Galería de Fotos
- Carousel interactivo de imágenes
- Efectos de hover elegantes
- Navegación intuitiva

### ✅ Sistema RSVP
- Formulario de confirmación de asistencia
- Validación de datos en tiempo real
- Almacenamiento en Supabase
- Panel de administración para ver respuestas

### 🎁 Registro de Regalos
- Lista de regalos sugeridos
- Integración para enlaces externos

## 🔒 Configuración de Supabase

El proyecto utiliza Supabase para:
- Almacenar respuestas RSVP
- Autenticación de administradores
- Gestión de invitados

### Pasos para configurar Supabase:

1. **Crear un proyecto en Supabase**
   - Ve a [Supabase](https://app.supabase.com) y crea un nuevo proyecto
   - Espera a que se complete la configuración inicial

2. **Ejecutar las migraciones**
   - Las tablas necesarias están definidas en `supabase/migrations/`
   - Puedes ejecutarlas desde el SQL Editor en el dashboard de Supabase
   - O usar el CLI de Supabase: `supabase db push`

3. **Obtener las credenciales**
   - Ve a **Settings → API** en tu proyecto de Supabase
   - Copia la **URL del proyecto** (Project URL)
   - Copia la **clave anónima** (anon/public key)

4. **Configurar variables de entorno**
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Agrega las siguientes variables:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_anonima_aqui
   ```
   - ⚠️ **Importante**: Reinicia el servidor de desarrollo después de crear/modificar `.env.local`

### Solución de problemas

Si ves el error "Hubo un problema al enviar tu confirmación":
- Verifica que el archivo `.env.local` existe y contiene las variables correctas
- Asegúrate de haber reiniciado el servidor de desarrollo (`npm run dev`)
- Revisa la consola del navegador para ver mensajes de error más detallados
- Verifica que las credenciales sean correctas en el dashboard de Supabase

## 📱 Rutas Disponibles

- `/` - Página principal con la invitación
- `/admin` - Panel de administración (requiere autenticación)
- `/auth` - Página de autenticación
- `/*` - Página 404 para rutas no encontradas

## 🚢 Despliegue

### Con Lovable

Si el proyecto está conectado a Lovable:
1. Visita tu proyecto en [Lovable](https://lovable.dev)
2. Haz clic en **Share → Publish**

### Manual

Para desplegar manualmente:

```bash
# Construir para producción
npm run build

# Los archivos estáticos estarán en la carpeta dist/
```

Puedes desplegar la carpeta `dist/` en cualquier servicio de hosting estático como:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🌐 Dominio Personalizado

Para conectar un dominio personalizado en Lovable:
1. Navega a **Project → Settings → Domains**
2. Haz clic en **Connect Domain**
3. Sigue las instrucciones de configuración

Más información: [Configuración de dominio personalizado](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 👨‍💻 Desarrollo

### Agregar Nuevos Componentes

Los componentes de UI utilizan shadcn/ui. Para agregar nuevos componentes:

```bash
npx shadcn-ui@latest add [nombre-componente]
```

### Estilos

El proyecto usa Tailwind CSS. Los estilos personalizados se encuentran en:
- `src/index.css` - Estilos globales y variables CSS
- `tailwind.config.ts` - Configuración de Tailwind

## 📝 Licencia

Este proyecto es privado.

## 👥 Contribuciones

Este es un proyecto personal. Para sugerencias o mejoras, por favor abre un issue.

---

**Desarrollado con 💖 para Mia Valentina**
