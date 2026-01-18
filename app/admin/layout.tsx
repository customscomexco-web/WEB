'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Settings,
  FileText,
  ShoppingBag,
  Users,
  Package,
  FolderOpen,
  MessageSquare,
  LogOut,
  HelpCircle,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Don't redirect if we're on the login page
    if (!isLoginPage && status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router, isLoginPage])

  // Show login page without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Redirigiendo...</div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/pages', label: 'Páginas', icon: FileText },
    { href: '/admin/posts', label: 'Noticias', icon: MessageSquare },
    { href: '/admin/categories', label: 'Categorías', icon: FolderOpen },
    { href: '/admin/products', label: 'Productos', icon: Package },
    { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
    { href: '/admin/leads', label: 'Leads Mayoristas', icon: Users },
    { href: '/admin/contact-queries', label: 'Consultas', icon: HelpCircle },
    { href: '/admin/media', label: 'Media', icon: FileText },
    { href: '/admin/site-settings', label: 'Configuración', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">{session.user?.email}</p>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

