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

    const categories = await prisma.category.findMany({
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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
      const existing = await prisma.category.findUnique({
        where: { slug: slugToCheck },
        select: { id: true },
      })
      return !!existing
    })

    // Prepare category data
    const categoryData: any = {
      name: body.name.trim(),
      slug: finalSlug,
      description: body.description?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      order: parseInt(body.order) || 0,
      visible: body.visible !== undefined ? Boolean(body.visible) : true,
    }

    const category = await prisma.category.create({
      data: categoryData,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug. El slug se generará automáticamente.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create category', details: error?.message },
      { status: 500 }
    )
  }
}
