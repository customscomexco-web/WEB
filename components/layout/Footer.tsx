'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Footer() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const socialLinks = settings?.socialLinks || {}

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">
              {settings?.siteName || "Customs & Comex Co"}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed">
              Servicios profesionales de comercio exterior
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Enlaces</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/servicios" className="hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/sobre-mi" className="hover:text-white transition-colors">
                  Sobre Mí
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-white transition-colors">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contacto</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {settings?.phone && (
                <li className="break-words">{settings.phone}</li>
              )}
              {settings?.address && (
                <li className="break-words">{settings.address}</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Redes Sociales</h4>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs sm:text-sm"
                >
                  Facebook
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs sm:text-sm"
                >
                  Instagram
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs sm:text-sm"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || "Customs & Comex Co"}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

