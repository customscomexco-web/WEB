'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function MinoristaPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {})

    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {})
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category?.slug === selectedCategory
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 px-4 sm:px-0">
          Catálogo Minorista
        </h1>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row gap-3 sm:gap-4 px-4 sm:px-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap text-sm sm:text-base ${
                selectedCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap text-sm sm:text-base ${
                  selectedCategory === cat.slug
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 py-8 sm:py-12 text-sm sm:text-base px-4">
            No se encontraron productos.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/importadora/minorista/productos/${product.slug}`}>
                  {product.images && Array.isArray(product.images) && product.images[0] && (
                    <div className="relative h-40 sm:h-48 md:h-56 bg-gray-200">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}
                    <p className="text-xl sm:text-2xl font-bold text-primary-600 mb-2 sm:mb-3">
                      ${product.priceRetail.toLocaleString()}
                    </p>
                  </div>
                </Link>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline">Agregar al Carrito</span>
                    <span className="sm:hidden">Agregar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

