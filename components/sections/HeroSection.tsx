'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeroSectionProps {
  content: {
    title?: string
    subtitle?: string
    primaryCta?: { text: string; link: string }
    secondaryCta?: { text: string; link: string }
    imageUrl?: string
  }
}

export function HeroSection({ content }: HeroSectionProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data?.logoUrl) {
          setLogoUrl(data.logoUrl)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${logoUrl ? 'pt-2 sm:pt-4 md:pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-24' : 'py-12 sm:py-16 md:py-20 lg:py-24'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {logoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-0 sm:mb-1 md:mb-1 flex justify-center"
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] object-contain max-w-full"
                style={{ maxWidth: 'min(800px, 95vw)' }}
              />
            </motion.div>
          )}
          {content.title && (
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 ${logoUrl ? '-mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10' : ''}`}>
              {content.title}
            </h1>
          )}
          {content.subtitle && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 px-4">
              {content.subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {content.primaryCta && (
              <Link
                href={content.primaryCta.link}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                {content.primaryCta.text}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            )}
            {content.secondaryCta && (
              <Link
                href={content.secondaryCta.link}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-sm sm:text-base"
              >
                {content.secondaryCta.text}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

