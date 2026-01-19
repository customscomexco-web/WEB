'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CartButton } from './CartButton'

export function Header() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false)
  }, [pathname])

  const whatsappNumber = settings?.whatsappNumber || '+5491112345678'
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/sobre-mi', label: 'Sobre Mí' },
    { href: '/noticias', label: 'Noticias' },
    { href: '/importadora', label: 'Importadora' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary-600">
            {settings?.siteName || "Custom's & Comex CO"}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm xl:text-base font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <CartButton />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>
            <Link
              href="/consultar"
              className="px-3 lg:px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Consultar</span>
              <span className="xl:hidden">Consultar</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-base font-medium transition-colors rounded-lg ${
                    pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-2 space-y-2 border-t border-gray-200">
                <CartButton />
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                <Link
                  href="/consultar"
                  className="block px-4 py-2 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors text-center"
                >
                  Consultar
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

