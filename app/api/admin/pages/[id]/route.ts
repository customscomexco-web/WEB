import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Handle params as Promise (Next.js 15+) or direct object (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params
    const pageId = resolvedParams.id

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Handle params as Promise (Next.js 15+) or direct object (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params
    const pageId = resolvedParams.id

    const body = await request.json()
    const { sections, id, slug, createdAt, updatedAt, ...pageData } = body

    console.log('Updating page:', pageId)
    console.log('Page data received:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!pageData.title || pageData.title.trim() === '') {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      )
    }

    // Prepare update data - only include fields that exist in the schema and are allowed to update
    const updateData: any = {
      title: pageData.title.trim(),
    }

    // Optional fields - only add if they are explicitly provided
    if ('seoTitle' in pageData) updateData.seoTitle = pageData.seoTitle ? pageData.seoTitle.trim() : null
    if ('seoDescription' in pageData) updateData.seoDescription = pageData.seoDescription ? pageData.seoDescription.trim() : null
    if ('ogImageUrl' in pageData) updateData.ogImageUrl = pageData.ogImageUrl || null
    if ('backgroundImageUrl' in pageData) updateData.backgroundImageUrl = pageData.backgroundImageUrl || null
    if ('published' in pageData) updateData.published = Boolean(pageData.published)

    console.log('Update data:', JSON.stringify(updateData, null, 2))

    // Update page
    const page = await prisma.page.update({
      where: { id: pageId },
      data: updateData,
    })

    // Update sections if provided
    if (sections && Array.isArray(sections)) {
      try {
        for (const section of sections) {
          if (!section.id) {
            console.warn('Section without ID skipped:', section)
            continue
          }
          await prisma.section.update({
            where: { id: section.id },
            data: {
              order: Number(section.order) || 0,
              visible: Boolean(section.visible),
              content: section.content || {},
            },
          })
        }
      } catch (sectionError: any) {
        console.error('Error updating sections:', sectionError)
        // Continue even if sections update fails - at least the page was updated
      }
    }

    // Fetch updated page with sections
    const updatedPage = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedPage)
  } catch (error: any) {
    console.error('Error updating page:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })

    let errorMessage = 'Error al guardar la página'
    
    if (error?.code === 'P2025') {
      errorMessage = 'La página no existe'
    } else if (error?.code === 'P2002') {
      errorMessage = 'Ya existe una página con ese slug'
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage, details: error?.message },
      { status: 500 }
    )
  }
}

