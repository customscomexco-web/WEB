import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, generateUniqueSlug } from '@/lib/slug'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

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

    // Get current product to check if slug changed
    const currentProduct = await prisma.product.findUnique({
      where: { id: params.id },
      select: { slug: true },
    })

    // Only generate unique slug if slug changed
    let finalSlug = slug
    if (!currentProduct || currentProduct.slug !== slug) {
      finalSlug = await generateUniqueSlug(slug, async (slugToCheck) => {
        // Don't check against current product
        if (currentProduct && currentProduct.slug === slugToCheck) {
          return false
        }
        const existing = await prisma.product.findUnique({
          where: { slug: slugToCheck },
          select: { id: true },
        })
        return !!existing
      })
    }

    // Prepare update data
    const updateData = {
      name: body.name.trim(),
      slug: finalSlug,
      shortDescription: body.shortDescription?.trim() || null,
      descriptionRichText: body.descriptionRichText || null,
      images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
      categoryId: body.categoryId || null,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []),
      priceRetail: parseFloat(body.priceRetail) || 0,
      priceWholesale: body.priceWholesale ? parseFloat(body.priceWholesale) : null,
      stock: parseInt(body.stock) || 0,
      sku: body.sku?.trim() || null,
      featured: Boolean(body.featured),
      active: body.active !== undefined ? Boolean(body.active) : true,
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)
    
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese slug. El slug se generará automáticamente.' },
        { status: 409 }
      )
    }

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update product', details: error?.message },
      { status: 500 }
    )
  }
}

