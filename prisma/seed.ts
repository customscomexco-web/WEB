import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: "Custom's & Comex CO",
      primaryColor: '#006d8c',
      whatsappNumber: '+5491112345678',
      address: 'Buenos Aires, Argentina',
      phone: '+54 11 1234-5678',
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
      },
    },
  })
  console.log('✅ Site settings created')

  // Create pages
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Inicio',
      seoTitle: "Custom's & Comex CO | Importación y Exportación",
      seoDescription: 'Servicios profesionales de comercio exterior. Importación, exportación y asesoramiento integral.',
      published: true,
    },
  })

  const serviciosPage = await prisma.page.upsert({
    where: { slug: 'servicios' },
    update: {},
    create: {
      slug: 'servicios',
      title: 'Servicios',
      seoTitle: 'Servicios de Comercio Exterior',
      seoDescription: 'Conoce todos nuestros servicios de importación y exportación.',
      published: true,
    },
  })

  const sobreMiPage = await prisma.page.upsert({
    where: { slug: 'sobre-mi' },
    update: {},
    create: {
      slug: 'sobre-mi',
      title: 'Sobre Mí',
      seoTitle: "Sobre Mí - Custom's & Comex CO",
      seoDescription: 'Conoce más sobre mi experiencia en comercio exterior.',
      published: true,
    },
  })

  const contactoPage = await prisma.page.upsert({
    where: { slug: 'contacto' },
    update: {},
    create: {
      slug: 'contacto',
      title: 'Contacto',
      seoTitle: "Contacto - Custom's & Comex CO",
      seoDescription: 'Contáctanos para más información sobre nuestros servicios.',
      published: true,
    },
  })

  const importadoraPage = await prisma.page.upsert({
    where: { slug: 'importadora' },
    update: {},
    create: {
      slug: 'importadora',
      title: 'Mi Importadora',
      seoTitle: 'Mi Importadora - Catálogo de Productos',
      seoDescription: 'Catálogo de productos importados. Minorista y mayorista.',
      published: true,
    },
  })

  const consultarPage = await prisma.page.upsert({
    where: { slug: 'consultar' },
    update: {},
    create: {
      slug: 'consultar',
      title: 'Consultar',
      seoTitle: 'Consultar - Contáctanos',
      seoDescription: 'Completa el formulario y nos pondremos en contacto contigo.',
      published: true,
      backgroundImageUrl: null,
    },
  })

  console.log('✅ Pages created')

  // Create demo sections for home page
  await prisma.section.createMany({
    data: [
      {
        pageId: homePage.id,
        type: 'HERO',
        order: 0,
        visible: true,
        content: {
          title: 'Comercio Exterior Profesional',
          subtitle: 'Importación y exportación con experiencia y confianza',
          primaryCta: { text: 'Consultar', link: '/consultar' },
          secondaryCta: { text: 'Conocer Servicios', link: '/servicios' },
          imageUrl: null,
        },
      },
      {
        pageId: homePage.id,
        type: 'SERVICES_GRID',
        order: 1,
        visible: true,
        content: {
          title: 'Nuestros Servicios',
          items: [
            {
              title: 'Importación',
              description: 'Gestión completa de importaciones',
              icon: 'package',
            },
            {
              title: 'Exportación',
              description: 'Asesoramiento en exportaciones',
              icon: 'globe',
            },
            {
              title: 'Despachos Aduaneros',
              description: 'Trámites aduaneros eficientes',
              icon: 'file-check',
            },
          ],
        },
      },
      {
        pageId: homePage.id,
        type: 'CTA_BAND',
        order: 2,
        visible: true,
        content: {
          text: '¿Listo para comenzar?',
          cta: { text: 'Consultar', link: '/consultar' },
        },
      },
    ],
    skipDuplicates: true,
  })

  // Create demo categories
  const cat1 = await prisma.category.create({
    data: {
      name: 'Electrónica',
      slug: 'electronica',
      description: 'Productos electrónicos importados',
      visible: true,
      order: 0,
    },
  })

  const cat2 = await prisma.category.create({
    data: {
      name: 'Hogar',
      slug: 'hogar',
      description: 'Artículos para el hogar',
      visible: true,
      order: 1,
    },
  })

  console.log('✅ Categories created')

  // Create demo products
  await prisma.product.createMany({
    data: [
      {
        name: 'Producto Demo 1',
        slug: 'producto-demo-1',
        shortDescription: 'Descripción corta del producto',
        images: ['/uploads/demo1.jpg'],
        categoryId: cat1.id,
        tags: ['destacado', 'nuevo'],
        priceRetail: 15000,
        priceWholesale: 12000,
        stock: 50,
        sku: 'PROD-001',
        featured: true,
        active: true,
      },
      {
        name: 'Producto Demo 2',
        slug: 'producto-demo-2',
        shortDescription: 'Otro producto de ejemplo',
        images: ['/uploads/demo2.jpg'],
        categoryId: cat2.id,
        tags: ['popular'],
        priceRetail: 25000,
        priceWholesale: 20000,
        stock: 30,
        sku: 'PROD-002',
        featured: false,
        active: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Products created')

  // Create demo post
  await prisma.post.create({
    data: {
      title: 'Primera Noticia',
      slug: 'primera-noticia',
      excerpt: 'Esta es una noticia de ejemplo',
      contentRichText: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Contenido de ejemplo de la primera noticia.' }],
          },
        ],
      },
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  })

  console.log('✅ Demo post created')
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

