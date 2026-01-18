'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<any>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    order: 0,
    visible: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)

  // Function to generate slug from name
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  useEffect(() => {
    if (params.id && params.id !== 'new') {
      fetch(`/api/admin/categories/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setCategory(data)
          setAutoGenerateSlug(false) // Don't auto-generate for existing categories
        })
        .catch(() => {})
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
      setAutoGenerateSlug(true) // Auto-generate for new categories
    }
  }, [params.id])

  // Auto-generate slug when name changes (only for new categories)
  useEffect(() => {
    if (autoGenerateSlug && category.name && params.id === 'new') {
      const generatedSlug = generateSlug(category.name)
      // Only update if slug is empty or matches a previous auto-generated slug
      setCategory((prev: any) => {
        const currentSlug = prev.slug || ''
        // If slug is empty or matches the old generated slug, update it
        if (!currentSlug || currentSlug === generateSlug(prev.name || '')) {
          return { ...prev, slug: generatedSlug }
        }
        return prev
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.name, params.id, autoGenerateSlug])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const url = params.id === 'new'
        ? '/api/admin/categories'
        : `/api/admin/categories/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      })

      if (response.ok) {
        alert('Categoría guardada correctamente')
        router.push('/admin/categories')
      } else {
        alert('Error al guardar')
      }
    } catch (error) {
      alert('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {params.id === 'new' ? 'Nueva Categoría' : 'Editar Categoría'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Guardar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            required
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Slug {params.id === 'new' ? '(se genera automáticamente)' : '*'}
          </label>
          <input
            type="text"
            required
            value={category.slug}
            onChange={(e) => {
              setCategory({ ...category, slug: e.target.value })
              setAutoGenerateSlug(false) // Stop auto-generation if user edits manually
            }}
            onBlur={(e) => {
              // Normalize slug on blur if user typed something
              if (e.target.value) {
                const normalized = generateSlug(e.target.value)
                setCategory({ ...category, slug: normalized })
              }
            }}
            placeholder={params.id === 'new' ? 'Se generará automáticamente desde el nombre' : ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {params.id === 'new' && (
            <p className="text-xs text-gray-500 mt-1">
              El slug se genera automáticamente desde el nombre. Puedes editarlo manualmente si lo deseas.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={category.description || ''}
            onChange={(e) => setCategory({ ...category, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Imagen (URL)
          </label>
          <input
            type="url"
            value={category.imageUrl || ''}
            onChange={(e) => setCategory({ ...category, imageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Orden
          </label>
          <input
            type="number"
            value={category.order}
            onChange={(e) => setCategory({ ...category, order: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={category.visible}
              onChange={(e) => setCategory({ ...category, visible: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold text-gray-700">Visible</span>
          </label>
        </div>
      </div>
    </div>
  )
}

