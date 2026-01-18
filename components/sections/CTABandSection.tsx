'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CTABandSectionProps {
  content: {
    text?: string
    cta?: { text: string; link: string }
  }
}

export function CTABandSection({ content }: CTABandSectionProps) {
  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-20 bg-primary-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6"
        >
          {content.text && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center lg:text-left px-4">
              {content.text}
            </h2>
          )}
          {content.cta && (
            <Link
              href={content.cta.link}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              {content.cta.text}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}

