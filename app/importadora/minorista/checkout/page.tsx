'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeft, MessageCircle } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    whatsapp: '',
    address: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'RETAIL',
          items: orderItems,
          total,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderId(order.id)
        clearCart()
      } else {
        alert('Error al crear el pedido. Por favor, intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el pedido. Por favor, intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderId) {
    const whatsappMessage = `Hola! Realicé un pedido en Mi Importadora.\n\nPedido #${orderId}\n\nProductos:\n${items.map(item => `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`).join('\n')}\n\nTotal: $${total.toLocaleString()}\n\nNombre: ${formData.customerName}\nEmail: ${formData.email}${formData.whatsapp ? `\nWhatsApp: ${formData.whatsapp}` : ''}${formData.address ? `\nDirección: ${formData.address}` : ''}${formData.notes ? `\nNotas: ${formData.notes}` : ''}`
    const whatsappLink = `https://wa.me/5491112345678?text=${encodeURIComponent(whatsappMessage)}`

    return (
      <div className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 sm:p-8 mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3 sm:mb-4">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-sm sm:text-base text-green-700 mb-2">
                Tu pedido ha sido registrado correctamente.
              </p>
              <p className="text-xs sm:text-sm text-green-600">
                ID del pedido: {orderId}
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Enviar Pedido por WhatsApp
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 sm:mb-8 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Carrito
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
                Checkout
              </h1>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Dirección (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </form>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                  Resumen del Pedido
                </h2>
                <div className="space-y-2 mb-3 sm:mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 flex-1 pr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-gray-900 font-semibold whitespace-nowrap">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-primary-600">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

