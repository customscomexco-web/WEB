'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function CarritoPage() {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 px-4">
              Tu carrito está vacío
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
              Agrega productos para comenzar tu compra.
            </p>
            <Link
              href="/importadora/minorista"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Volver al Catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Carrito de Compras
            </h1>
            <Link
              href="/importadora/minorista"
              className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Seguir Comprando
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-200 last:border-b-0"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-20 sm:h-20 h-32 sm:h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 w-full sm:w-auto">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-primary-600 font-semibold text-sm sm:text-base">
                    ${item.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-right font-semibold text-sm sm:text-base text-gray-900 sm:min-w-[80px]">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <span className="text-lg sm:text-xl font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                ${total.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => router.push('/importadora/minorista/checkout')}
              className="w-full px-5 sm:px-6 py-3 sm:py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              Proceder al Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

