'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0)
  const { addToCart } = useCart()

  // Calculate images before early return to ensure consistent hook order
  const images = useMemo(() => {
    return product?.images && Array.isArray(product.images) ? product.images : []
  }, [product?.images])

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/products/${params.slug}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(() => {})
    }
  }, [params.slug])

  // Handle keyboard navigation - moved before early return
  useEffect(() => {
    if (!isLightboxOpen || images.length === 0) {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
        document.body.style.overflow = 'unset'
      } else if (e.key === 'ArrowRight') {
        setLightboxImageIndex((prev) => (prev + 1) % images.length)
      } else if (e.key === 'ArrowLeft') {
        setLightboxImageIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isLightboxOpen, images.length])

  if (!product) {
    return (
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm sm:text-base">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index)
    setIsLightboxOpen(true)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    setLightboxImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    if (images.length > 0) {
      setLightboxImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <div className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Images */}
          <div>
            {images.length > 0 ? (
              <>
                <button
                  onClick={() => openLightbox(selectedImage)}
                  className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] mb-3 sm:mb-4 rounded-lg overflow-hidden bg-gray-200 w-full cursor-zoom-in hover:opacity-95 transition-opacity"
                >
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0">
                    {images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                          selectedImage === index
                            ? 'border-primary-600'
                            : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                <span className="text-sm sm:text-base text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-sm sm:text-base text-primary-600 mb-3 sm:mb-4">
                {product.category.name}
              </p>
            )}
            <p className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4 sm:mb-6">
              ${product.priceRetail.toLocaleString()}
            </p>
            {product.shortDescription && (
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                {product.shortDescription}
              </p>
            )}
            {product.stock !== undefined && (
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Stock disponible: {product.stock}
              </p>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <label className="text-sm sm:text-base font-semibold">Cantidad:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
                >
                  -
                </button>
                <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              Agregar al Carrito
            </button>

            {/* Description */}
            {product.descriptionRichText && (
              <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700">
                {/* Render TipTap content here */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Descripción completa del producto (renderizar TipTap JSON)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxImageIndex]}
              alt={`${product.name} - Imagen ${lightboxImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm sm:text-base">
              {lightboxImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnails (optional, for better UX) */}
          {images.length > 1 && images.length <= 6 && (
            <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxImageIndex(index)
                  }}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    lightboxImageIndex === index
                      ? 'border-white'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

