import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const section = await prisma.section.findUnique({
      where: { id: params.id },
      include: {
        page: true,
      },
    })

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section' },
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
    console.log('Updating section:', params.id, JSON.stringify(body, null, 2))

    // Only include fields that can be updated
    const updateData: any = {
      type: body.type,
      content: body.content || {},
      visible: body.visible !== undefined ? Boolean(body.visible) : true,
      order: body.order !== undefined ? parseInt(body.order) : 0,
    }

    console.log('Update data:', JSON.stringify(updateData, null, 2))

    const section = await prisma.section.update({
      where: { id: params.id },
      data: updateData,
      include: {
        page: {
          select: { slug: true },
        },
      },
    })

    console.log('Section updated successfully')
    return NextResponse.json(section)
  } catch (error: any) {
    console.error('Error updating section:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Sección no encontrada' },
        { status: 404 }
      )
    }

    let errorMessage = 'Error al actualizar la sección'
    if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage, details: error?.message, code: error?.code },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get page info before deleting
    const section = await prisma.section.findUnique({
      where: { id: params.id },
      include: {
        page: {
          select: { slug: true },
        },
      },
    })

    await prisma.section.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    )
  }
}

