'use client'

import { motion } from 'framer-motion'

interface StatsSectionProps {
  content: {
    title?: string
    items?: Array<{
      value: string
      label: string
      icon?: string
    }>
  }
}

export function StatsSection({ content }: StatsSectionProps) {
  const items = content.items || []

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primary-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-white px-4">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center px-2 sm:px-4"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                {item.value}
              </div>
              <div className="text-sm sm:text-base text-gray-200 leading-tight">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

