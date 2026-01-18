'use client'

import { useEffect, useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

interface ContactBlockSectionProps {
  content: {
    title?: string
    showForm?: boolean
  }
}

export function ContactBlockSection({ content }: ContactBlockSectionProps) {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const whatsappNumber = settings?.whatsappNumber || '+5491112345678'
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`

  return (
    <section id="contacto" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900 px-4">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
              Información de Contacto
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {settings?.phone && (
                <div className="flex items-start sm:items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <a href={`tel:${settings.phone}`} className="text-sm sm:text-base text-gray-700 hover:text-primary-600 break-all">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-start sm:items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-sm sm:text-base text-gray-700 break-words">{settings.address}</span>
                </div>
              )}
              <div className="flex items-start sm:items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-gray-700 hover:text-primary-600"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          {content.showForm && (
            <div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

