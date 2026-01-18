'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface ImageTextSectionProps {
  content: {
    title?: string
    text?: string
    imageUrl?: string
    imagePosition?: 'left' | 'right'
    cta?: { text: string; link: string }
  }
}

export function ImageTextSection({ content }: ImageTextSectionProps) {
  const imagePosition = content.imagePosition || 'right'

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center`}>
          {content.imageUrl && (
            <motion.div
              initial={{ opacity: 0, x: imagePosition === 'right' ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-lg overflow-hidden">
                <Image
                  src={content.imageUrl}
                  alt={content.title || 'Image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'right' ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            {content.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
                {content.title}
              </h2>
            )}
            {content.text && (
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {content.text}
              </p>
            )}
            {content.cta && (
              <a
                href={content.cta.link}
                className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                {content.cta.text}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

