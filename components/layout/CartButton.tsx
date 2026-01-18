'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Link
      href="/importadora/minorista/carrito"
      className="relative flex items-center gap-2 px-2 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="hidden lg:inline">Carrito</span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          {itemCount}
        </span>
      )}
    </Link>
  )
}

