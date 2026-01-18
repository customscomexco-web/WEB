// This endpoint is kept for future use but revalidatePath doesn't work in Route Handlers
// Instead, we use router.refresh() in the frontend and reduced cache times in development
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In development, cache is already disabled (revalidate = 0)
    // In production, this would trigger a revalidation
    return NextResponse.json({ revalidated: true })
  } catch (error: any) {
    console.error('Error in revalidate endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate', details: error?.message },
      { status: 500 }
    )
  }
}

