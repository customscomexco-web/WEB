import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    console.log('Creating section with data:', JSON.stringify(body, null, 2))

    const { pageId, type, content, order, visible } = body

    // Validate required fields
    if (!pageId || !type) {
      return NextResponse.json(
        { error: 'pageId y type son requeridos' },
        { status: 400 }
      )
    }

    // Verify page exists and get slug
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { id: true, slug: true },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'La página no existe' },
        { status: 404 }
      )
    }

    // Get max order for this page
    const maxOrder = await prisma.section.aggregate({
      where: { pageId },
      _max: { order: true },
    })

    const sectionData: any = {
      pageId,
      type,
      content: content || {},
      order: order !== undefined ? parseInt(order) : ((maxOrder._max.order ?? -1) + 1),
      visible: visible !== undefined ? Boolean(visible) : true,
    }

    console.log('Section data to create:', JSON.stringify(sectionData, null, 2))

    const section = await prisma.section.create({
      data: sectionData,
    })

    console.log('Section created successfully:', section.id)
    return NextResponse.json(section, { status: 201 })
  } catch (error: any) {
    console.error('Error creating section:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })

    let errorMessage = 'Error al crear la sección'
    if (error?.code === 'P2003') {
      errorMessage = 'La página especificada no existe'
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage, details: error?.message, code: error?.code },
      { status: 500 }
    )
  }
}

