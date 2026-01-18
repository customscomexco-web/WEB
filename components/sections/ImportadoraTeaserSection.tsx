'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ImportadoraTeaserSectionProps {
  content: {
    title?: string
    subtitle?: string
    featuredProducts?: string[] // Product slugs
    cta?: { text: string; link: string }
  }
}

export function ImportadoraTeaserSection({ content }: ImportadoraTeaserSectionProps) {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (content.featuredProducts && content.featuredProducts.length > 0) {
      Promise.all(
        content.featuredProducts.map(slug =>
          fetch(`/api/products/${slug}`).then(res => res.json()).catch(() => null)
        )
      ).then(results => {
        setProducts(results.filter(Boolean))
      })
    } else {
      // Fetch featured products
      fetch('/api/products?featured=true&limit=3')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(() => {})
    }
  }, [content.featuredProducts])

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-900 px-4">
            {content.title}
          </h2>
        )}
        {content.subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            {content.subtitle}
          </p>
        )}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {product.images && product.images[0] && (
                  <div className="relative h-40 sm:h-48 md:h-56 bg-gray-200">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
                    {product.name}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}
                  <p className="text-xl sm:text-2xl font-bold text-primary-600">
                    ${product.priceRetail.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {content.cta && (
          <div className="text-center px-4">
            <Link
              href={content.cta.link}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              {content.cta.text}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

