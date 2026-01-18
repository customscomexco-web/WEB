import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const orderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  type: z.enum(['RETAIL', 'WHOLESALE']),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })),
  total: z.number().positive(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = orderSchema.parse(body)

    const order = await prisma.order.create({
      data: {
        customerName: validated.customerName,
        email: validated.email,
        whatsapp: validated.whatsapp,
        type: validated.type,
        items: validated.items,
        total: validated.total,
        address: validated.address,
        notes: validated.notes,
        status: 'NEW',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

