import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      console.error('No session found for media upload')
      return NextResponse.json(
        { error: 'No autorizado. Por favor inicia sesión nuevamente.' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      console.error('Insufficient permissions:', session.user.role)
      return NextResponse.json(
        { error: 'No tienes permisos para subir archivos.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Validate file size (max 15MB)
    const maxSize = 15 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. El tamaño máximo es de 15MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${extension}`

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    // Save to database
    const mediaFile = await prisma.mediaFile.create({
      data: {
        url,
        alt: file.name,
        size: file.size,
        mime: file.type,
      },
    })

    return NextResponse.json(mediaFile)
  } catch (error: any) {
    console.error('Error uploading file:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })
    
    // Return more specific error messages
    let errorMessage = 'Error al subir el archivo'
    
    if (error?.code === 'P2002') {
      errorMessage = 'Ya existe un archivo con este nombre'
    } else if (error?.message?.includes('ENOENT')) {
      errorMessage = 'Error al crear el directorio de uploads'
    } else if (error?.message?.includes('EACCES')) {
      errorMessage = 'No tienes permisos para escribir en el directorio'
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error?.message },
      { status: 500 }
    )
  }
}

