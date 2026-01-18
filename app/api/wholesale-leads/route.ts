import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
  companyName: z.string().min(1),
  cuit: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = leadSchema.parse(body)

    const lead = await prisma.wholesaleLead.create({
      data: {
        companyName: validated.companyName,
        cuit: validated.cuit,
        name: validated.name,
        email: validated.email,
        whatsapp: validated.whatsapp,
        city: validated.city,
        notes: validated.notes,
        status: 'NEW',
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating wholesale lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

