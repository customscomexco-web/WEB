import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, generateUniqueSlug } from '@/lib/slug'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Creating product with data:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    // Generate slug automatically if not provided or empty
    let slug = body.slug?.trim() || ''
    if (!slug) {
      slug = generateSlug(body.name)
    } else {
      // Ensure the provided slug is URL-friendly
      slug = generateSlug(slug)
    }

    // Generate unique slug if it already exists
    const finalSlug = await generateUniqueSlug(slug, async (slugToCheck) => {
      const existing = await prisma.product.findUnique({
        where: { slug: slugToCheck },
        select: { id: true },
      })
      return !!existing
    })

    // Prepare product data - only include fields that exist in the schema
    const productData: any = {
      name: body.name.trim(),
      slug: finalSlug,
      shortDescription: body.shortDescription?.trim() || null,
      descriptionRichText: body.descriptionRichText || null,
      images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
      categoryId: body.categoryId && body.categoryId !== '' ? body.categoryId : null,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : null),
      priceRetail: parseFloat(body.priceRetail) || 0,
      priceWholesale: body.priceWholesale ? parseFloat(body.priceWholesale) : null,
      stock: parseInt(body.stock) || 0,
      sku: body.sku?.trim() || null,
      featured: Boolean(body.featured),
      active: body.active !== undefined ? Boolean(body.active) : true,
    }

    console.log('Product data to create:', JSON.stringify(productData, null, 2))

    const product = await prisma.product.create({
      data: productData,
    })

    console.log('Product created successfully:', product.id)
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })
    
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese slug. El slug se generará automáticamente.' },
        { status: 409 }
      )
    }

    let errorMessage = 'Error al crear el producto'
    if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage, details: error?.message, code: error?.code },
      { status: 500 }
    )
  }
}
