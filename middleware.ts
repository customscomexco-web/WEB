import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isLoginPage = req.nextUrl.pathname === '/admin/login'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin')
    
    // Allow access to login page
    if (isLoginPage) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    if ((isAdminRoute || isApiAdminRoute) && !token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Check role for admin routes
    if ((isAdminRoute || isApiAdminRoute) && token && token.role !== 'ADMIN' && token.role !== 'EDITOR') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === '/admin/login'
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
        const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin')

        // Allow login page without auth
        if (isLoginPage) {
          return true
        }

        // For admin routes, require authentication and proper role
        if (isAdminRoute || isApiAdminRoute) {
          return !!token && (token.role === 'ADMIN' || token.role === 'EDITOR')
        }

        // Allow all other routes
        return true
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

