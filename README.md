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
# Crear archivo .env.local con tus credenciales de Supabase
# VITE_SUPABASE_URL=tu_url_supabase
# VITE_SUPABASE_ANON_KEY=tu_clave_anonima

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

Asegúrate de configurar:
1. Un proyecto en Supabase
2. Las tablas necesarias (ver migraciones en `supabase/migrations/`)
3. Variables de entorno con tus credenciales

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
