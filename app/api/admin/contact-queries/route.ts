import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const queries = await prisma.contactQuery.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(queries)
  } catch (error) {
    console.error('Error fetching contact queries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact queries' },
      { status: 500 }
    )
  }
}

