'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

interface TestimonialsSectionProps {
  content: {
    title?: string
    items?: Array<{
      name: string
      role?: string
      company?: string
      text: string
      imageUrl?: string
    }>
  }
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const items = content.items || []

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900 px-4">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic leading-relaxed">
                "{item.text}"
              </p>
              <div>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{item.name}</p>
                {item.role && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    {item.role}
                    {item.company && ` en ${item.company}`}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

