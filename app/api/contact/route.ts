import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1, 'Mensaje es requerido'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received contact form data:', body)

    // Validate input
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors)
      return NextResponse.json(
        { 
          error: 'Datos inválidos', 
          message: 'Por favor verifica que todos los campos requeridos estén completos',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Save to database
    const contactQuery = await prisma.contactQuery.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        company: data.company || null,
        message: data.message,
        status: 'NEW',
      },
    })

    console.log('Contact query created successfully:', contactQuery.id)
    return NextResponse.json({ success: true, id: contactQuery.id }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating contact query:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    })
    
    // Handle Prisma errors specifically
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una consulta con este email' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la consulta',
        message: error?.message || 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

