'use client'

import { motion } from 'framer-motion'
import { Package, Globe, FileCheck, TrendingUp, Shield, HeadphonesIcon } from 'lucide-react'

const iconMap: Record<string, any> = {
  package: Package,
  globe: Globe,
  'file-check': FileCheck,
  'trending-up': TrendingUp,
  shield: Shield,
  headphones: HeadphonesIcon,
}

interface ServicesGridSectionProps {
  content: {
    title?: string
    items?: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
}

export function ServicesGridSection({ content }: ServicesGridSectionProps) {
  const items = content.items || []

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900 px-4">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {items.map((item, index) => {
            const Icon = item.icon ? iconMap[item.icon] || Package : Package
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 text-center">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

