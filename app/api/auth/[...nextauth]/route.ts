import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('⚠️ NEXTAUTH_SECRET is not set in environment variables')
}

if (!process.env.NEXTAUTH_URL) {
  console.error('⚠️ NEXTAUTH_URL is not set in environment variables')
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

