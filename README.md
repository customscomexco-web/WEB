# Página Web Vicky - Sistema de Comercio Exterior

Sistema completo 100% propio para gestión de sitio web y ecommerce (minorista y mayorista) sin dependencias de CMS externos.

## 🚀 Stack Tecnológico

- **Next.js 14+** (App Router) con TypeScript
- **TailwindCSS** para estilos
- **Framer Motion** para animaciones
- **PostgreSQL** como base de datos
- **Prisma** como ORM
- **NextAuth** para autenticación con roles
- **TipTap** para editor rich-text
- **Parallax** personalizado con scroll (sin Three.js)

## 📋 Características

### Sitio Público
- Landing page con parallax animado
- Páginas dinámicas editables desde admin
- Blog/Noticias
- Ecommerce minorista (catálogo, carrito, checkout)
- Ecommerce mayorista (solicitud de acceso, catálogo)
- SEO optimizado con metadata dinámica

### Panel Admin
- Gestión completa de páginas y secciones
- Editor de contenido rich-text
- CRUD de productos, categorías, noticias
- Gestión de pedidos y leads mayoristas
- Upload de imágenes
- Configuración del sitio

### Parallax
- 3 escenas animadas que reaccionan al scroll:
  - Home Hero: Cielo con nubes y avión
  - Servicios: Horizonte marítimo con barco
  - Importadora: Puerto con contenedores y grúas

## 🛠️ Setup Local

### Prerrequisitos

- Node.js 18+
- Docker y Docker Compose (para PostgreSQL)
- npm o yarn

### Instalación

1. **Clonar el repositorio** (o usar el directorio actual)

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env` y configurar:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pagina_web_vicky?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
```

4. **Iniciar PostgreSQL con Docker:**
```bash
docker-compose up -d
```

5. **Ejecutar migraciones de Prisma:**
```bash
npm run db:push
```

6. **Poblar la base de datos con datos iniciales:**
```bash
npm run db:seed
```

Esto creará:
- Usuario admin: `admin@example.com` / `admin123`
- Configuración del sitio
- Páginas demo (home, servicios, sobre-mi, contacto, importadora)
- Categorías y productos de ejemplo
- Noticia de ejemplo

7. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

8. **Abrir en el navegador:**
- Sitio público: http://localhost:3000
- Panel admin: http://localhost:3000/admin/login

## 📁 Estructura del Proyecto

```
/
├── app/                    # Next.js App Router
│   ├── admin/              # Panel admin (protegido)
│   ├── api/               # API routes
│   ├── importadora/       # Ecommerce (minorista/mayorista)
│   ├── noticias/          # Blog
│   └── [slug]/            # Páginas dinámicas
├── components/
│   ├── layout/           # Header, Footer
│   ├── parallax/         # Componentes parallax
│   └── sections/         # Renderizadores de secciones
├── contexts/             # React contexts (Cart)
├── lib/                  # Utilidades (Prisma, Auth)
├── prisma/
│   ├── schema.prisma     # Schema de base de datos
│   └── seed.ts          # Script de seed
└── public/
    └── uploads/         # Imágenes subidas
```

## 🗄️ Modelo de Datos

### Principales Entidades

- **User**: Usuarios del sistema (ADMIN, EDITOR)
- **Page**: Páginas del sitio (home, servicios, etc.)
- **Section**: Secciones dinámicas de cada página (HERO, SERVICES_GRID, etc.)
- **Post**: Noticias/Blog
- **Category**: Categorías de productos
- **Product**: Productos del ecommerce
- **Order**: Pedidos (RETAIL/WHOLESALE)
- **WholesaleLead**: Solicitudes de acceso mayorista
- **SiteSettings**: Configuración global del sitio
- **MediaFile**: Archivos subidos

## 🔐 Autenticación y Roles

- **ADMIN**: Acceso completo a todas las funcionalidades
- **EDITOR**: Puede editar páginas, posts y productos, pero no usuarios ni configuraciones críticas

## 📝 Uso del Panel Admin

### Editar Páginas

1. Ir a `/admin/pages`
2. Seleccionar una página
3. Editar secciones:
   - Reordenar (drag & drop - implementar)
   - Toggle visible/oculto
   - Editar contenido según tipo de sección
   - Agregar nuevas secciones

### Gestión de Productos

1. Ir a `/admin/products`
2. Crear/editar productos
3. Subir imágenes
4. Configurar precios (minorista y mayorista)
5. Gestionar stock

### Gestión de Pedidos

1. Ir a `/admin/orders`
2. Ver todos los pedidos
3. Actualizar estado (NEW → IN_PROGRESS → DONE)

### Leads Mayoristas

1. Ir a `/admin/leads`
2. Ver solicitudes de acceso
3. Actualizar estado (NEW → CONTACTED → APPROVED/REJECTED)

## 🎨 Parallax

Los componentes parallax están en `/components/parallax/`:

- `ParallaxScene`: Componente wrapper principal
- `ParallaxScene1`: Escena Hero (cielo + nubes + avión)
- `ParallaxScene2`: Escena Servicios (mar + barco)
- `ParallaxScene3`: Escena Importadora (puerto + contenedores)

Respetan `prefers-reduced-motion` y se desactivan automáticamente si está activo.

## 🚢 Ecommerce

### Minorista

- Catálogo con filtros por categoría
- Página de producto (PDP)
- Carrito persistente en localStorage
- Checkout con formulario
- Generación de pedido en DB
- Botón para enviar pedido por WhatsApp

### Mayorista

- Formulario de solicitud de acceso
- Una vez aprobado, acceso a catálogo con precios mayoristas
- Mismo flujo de pedidos que minorista

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Iniciar producción
npm run db:push      # Sincronizar schema con DB
npm run db:migrate   # Crear migración
npm run db:seed      # Poblar DB con datos demo
npm run db:studio    # Abrir Prisma Studio
```

## 📦 Deploy

### Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Configurar base de datos PostgreSQL externa (ej: Supabase, Neon)
4. Deploy automático

### Variables de Entorno en Producción

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="secret-production-seguro"
NODE_ENV="production"
```

## 🐳 Docker

Para desarrollo local con PostgreSQL:

```bash
docker-compose up -d    # Iniciar
docker-compose down     # Detener
docker-compose logs     # Ver logs
```

## 📝 Notas Importantes

- **Upload de imágenes**: En desarrollo se guardan en `/public/uploads`. En producción, preparar para S3.
- **Editor Rich-Text**: Actualmente usa TipTap. El contenido se guarda como JSON en la DB.
- **Cache**: Las páginas públicas tienen revalidate de 60s. Ajustar según necesidades.
- **SEO**: Metadata dinámica por página. Generar sitemap y robots.txt si es necesario.

## 🔄 Próximos Pasos / Mejoras

- [ ] Implementar drag & drop para reordenar secciones
- [ ] Editor TipTap completo con todas las opciones
- [ ] Integración con S3 para uploads en producción
- [ ] Sitemap.xml y robots.txt dinámicos
- [ ] Rate limiting en formularios públicos
- [ ] Notificaciones por email para nuevos pedidos/leads
- [ ] Dashboard con gráficos y estadísticas
- [ ] Exportar pedidos a Excel/PDF

## 📄 Licencia

Privado - Todos los derechos reservados

## 👤 Soporte

Para consultas o problemas, contactar al equipo de desarrollo.

