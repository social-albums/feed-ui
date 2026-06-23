# Instagram-style Frontend (React + TypeScript)
Frontend de red social tipo Instagram construido con **React 18** y **TypeScript**, diseñado para consumir la API del backend Go.

## Stack
| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript |
| Estado Global | Zustand / Redux Toolkit |
| HTTP Client | Axios + React Query (TanStack Query) |
| Routing | React Router v6 |
| UI Components | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Build Tool | Vite |
| Testing | Vitest + React Testing Library |

## Arquitectura del Proyecto
```
web-frontend/
├── public/                     # Assets estáticos
├── src/
│   ├── assets/                 # Imágenes, iconos, fuentes
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes base (Button, Input, Card)
│   │   ├── layout/             # Header, Sidebar, Footer
│   │   ├── auth/               # LoginForm, RegisterForm
│   │   ├── feed/               # FeedList, PostCard, PostItem
│   │   ├── posts/              # PostCreator, MediaUploader
│   │   ├── profile/            # ProfileHeader, UserStats
│   │   └── social/             # FollowButton, FollowerList
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts          # Gestión de autenticación
│   │   ├── useFeed.ts          # Lógica del feed
│   │   ├── usePosts.ts         # CRUD de posts
│   │   └── useSocial.ts        # Follow/unfollow
│   ├── pages/                  # Páginas/rutas
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── FeedPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── PostDetailPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/               # API clients
│   │   ├── api.ts              # Configuración de Axios
│   │   ├── authService.ts      # Endpoints de auth (:8080)
│   │   ├── feedService.ts      # Endpoints de feed (:8081)
│   │   ├── contentService.ts   # Endpoints de posts (:8082)
│   │   └── socialService.ts    # Endpoints de social (:8083)
```

## Stack Tecnológico:
React 18 + TypeScript
Zustand/Redux Toolkit para estado global
Axios + React Query (TanStack Query)
React Router v6
Tailwind CSS + shadcn/ui
Vite como build tool

## Arquitectura Detallada:
Estructura completa de directorios
Separación por capas (components, hooks, pages, services, store, types, utils)
🔌 Integración con el Backend:
Conexión a los 4 servicios (auth:8080, feed:8081, content:8082, social:8083)
Ejemplos de código para interceptores de Axios
Generación automática de tipos desde OpenAPI spec

## Funcionalidades MVP:
Autenticación (login, register, logout, refresh token)
Feed principal con infinite scroll
CRUD de posts con upload de media
Sistema social (follow/unfollow, stats)
Perfiles de usuario

## Extras:
Variables de entorno configuradas
Comandos npm disponibles
Ejemplos de componentes principales (PostCard, FeedList)
Consideraciones de seguridad
Dockerfile para deploy

