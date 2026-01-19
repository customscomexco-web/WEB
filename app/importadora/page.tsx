import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, Building2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ParallaxScene } from '@/components/parallax/ParallaxScene'

export const dynamic = 'force-dynamic'
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60

export const metadata: Metadata = {
  title: 'Mi Importadora - Catálogo de Productos',
  description: 'Catálogo de productos importados. Minorista y mayorista.',
}

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      featured: true,
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })

  return products
}

export default async function ImportadoraPage() {
  const products = await getFeaturedProducts()

  return (
    <>
      <ParallaxScene type="importadora" className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg px-4">
              Mi Importadora
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 drop-shadow px-4">
              Productos importados de calidad. Minorista y mayorista.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/importadora/minorista"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Comprar Minorista
              </Link>
              <Link
                href="/importadora/mayorista"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Solicitar Acceso Mayorista
              </Link>
            </div>
          </div>
        </div>
      </ParallaxScene>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900 px-4">
            Productos Destacados
          </h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-600 text-sm sm:text-base px-4">No hay productos destacados aún.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/importadora/minorista/productos/${product.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {product.images && Array.isArray(product.images) && product.images[0] && (
                    <div className="relative h-40 sm:h-48 md:h-56 bg-gray-200">
                      <img
                        src={String(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}
                    <p className="text-xl sm:text-2xl font-bold text-primary-600">
                      ${product.priceRetail.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

