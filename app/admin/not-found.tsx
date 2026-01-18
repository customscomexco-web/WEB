import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">La página que buscas no existe.</p>
        <Link
          href="/admin/dashboard"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}

