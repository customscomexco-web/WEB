'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft, Upload, X, Plus } from 'lucide-react'
import Link from 'next/link'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>({
    name: '',
    slug: '',
    shortDescription: '',
    descriptionRichText: null,
    images: [],
    categoryId: '',
    tags: [],
    priceRetail: 0,
    priceWholesale: 0,
    stock: 0,
    sku: '',
    featured: false,
    active: true,
  })
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const imagesInputRef = useRef<HTMLInputElement>(null)

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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('Categories fetched:', data)
        setCategories(Array.isArray(data) ? data : [])
      } else {
        console.error('Error fetching categories:', response.status)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()

    if (params.id && params.id !== 'new') {
      fetch(`/api/admin/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setProduct({
            ...data,
            images: Array.isArray(data.images) ? data.images : [],
            tags: Array.isArray(data.tags) ? data.tags : [],
          })
          setAutoGenerateSlug(false) // Don't auto-generate for existing products
        })
        .catch(() => {})
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
      setAutoGenerateSlug(true) // Auto-generate for new products
    }
  }, [params.id])

  // Auto-generate slug when name changes (only for new products)
  useEffect(() => {
    if (autoGenerateSlug && product.name && params.id === 'new') {
      const generatedSlug = generateSlug(product.name)
      // Only update if slug is empty or matches a previous auto-generated slug
      setProduct((prev: any) => {
        const currentSlug = prev.slug || ''
        // If slug is empty or matches the old generated slug, update it
        if (!currentSlug || currentSlug === generateSlug(prev.name || '')) {
          return { ...prev, slug: generatedSlug }
        }
        return prev
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.name, params.id, autoGenerateSlug])

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of Array.from(selectedFiles)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const uploadedFile = await response.json()
          uploadedUrls.push(uploadedFile.url)
        } else {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || errorData.message || 'Error al subir la imagen'
          console.error('Upload error response:', errorData)
          alert(`Error al subir ${file.name}: ${errorMessage}`)
        }
      }

      if (uploadedUrls.length > 0) {
        const currentImages = Array.isArray(product.images) ? product.images : []
        setProduct({
          ...product,
          images: [...currentImages, ...uploadedUrls],
        })
        alert(`${uploadedUrls.length} imagen(es) subida(s) correctamente`)
      }
    } catch (error: any) {
      console.error('Error uploading images:', error)
      const errorMessage = error?.message || 'Error de conexión al subir las imágenes'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsUploadingImages(false)
      if (imagesInputRef.current) {
        imagesInputRef.current.value = ''
      }
    }
  }

  const removeImage = (indexToRemove: number) => {
    const currentImages = Array.isArray(product.images) ? product.images : []
    setProduct({
      ...product,
      images: currentImages.filter((_: any, index: number) => index !== indexToRemove),
    })
  }

  const addImageUrl = (url: string) => {
    if (!url.trim()) return
    const currentImages = Array.isArray(product.images) ? product.images : []
    setProduct({
      ...product,
      images: [...currentImages, url.trim()],
    })
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('El nombre de la categoría es requerido')
      return
    }

    setIsCreatingCategory(true)
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description.trim() || null,
          visible: true,
        }),
      })

      if (response.ok) {
        const createdCategory = await response.json()
        console.log('Category created:', createdCategory)
        
        // Refresh categories list and wait for it to complete
        await fetchCategories()
        
        // Select the newly created category immediately
        setProduct((prev: any) => ({ ...prev, categoryId: createdCategory.id }))
        
        // Reset form and close modal
        setNewCategory({ name: '', description: '' })
        setShowNewCategoryModal(false)
        
        // Small delay to ensure UI updates
        setTimeout(() => {
          alert('Categoría creada correctamente y seleccionada')
        }, 50)
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || 'Error al crear la categoría'
        console.error('Error response:', errorData)
        alert(errorMessage)
      }
    } catch (error: any) {
      console.error('Error creating category:', error)
      const errorMessage = error?.message || 'Error de conexión al crear la categoría'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsCreatingCategory(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const url = params.id === 'new'
        ? '/api/admin/products'
        : `/api/admin/products/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PUT'

      // Ensure images is always an array
      const productToSave = {
        ...product,
        images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
        tags: Array.isArray(product.tags) ? product.tags : (product.tags ? [product.tags] : []),
        categoryId: product.categoryId && product.categoryId !== '' ? product.categoryId : null,
      }

      console.log('Saving product:', JSON.stringify(productToSave, null, 2))

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave),
      })

      if (response.ok) {
        alert('Producto guardado correctamente')
        router.push('/admin/products')
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || 'Error al guardar'
        console.error('Error response:', errorData)
        alert(errorMessage)
      }
    } catch (error: any) {
      console.error('Error saving product:', error)
      const errorMessage = error?.message || 'Error de conexión al guardar'
      alert(`Error: ${errorMessage}`)
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
            href="/admin/products"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {params.id === 'new' ? 'Nuevo Producto' : 'Editar Producto'}
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
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
            value={product.slug}
            onChange={(e) => {
              setProduct({ ...product, slug: e.target.value })
              setAutoGenerateSlug(false) // Stop auto-generation if user edits manually
            }}
            onBlur={(e) => {
              // Normalize slug on blur if user typed something
              if (e.target.value) {
                const normalized = generateSlug(e.target.value)
                setProduct({ ...product, slug: normalized })
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
            Descripción Corta
          </label>
          <textarea
            value={product.shortDescription || ''}
            onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio Minorista *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={product.priceRetail}
              onChange={(e) => setProduct({ ...product, priceRetail: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio Mayorista
            </label>
            <input
              type="number"
              step="0.01"
              value={product.priceWholesale || 0}
              onChange={(e) => setProduct({ ...product, priceWholesale: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              value={product.sku || ''}
              onChange={(e) => setProduct({ ...product, sku: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Categoría
            </label>
            <button
              type="button"
              onClick={() => setShowNewCategoryModal(true)}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus className="w-3 h-3" />
              Nueva Categoría
            </button>
          </div>
          <select
            value={product.categoryId || ''}
            onChange={(e) => setProduct({ ...product, categoryId: e.target.value || null })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Modal para crear nueva categoría */}
        {showNewCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nueva Categoría</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Electrónica"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Descripción de la categoría"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryModal(false)
                    setNewCategory({ name: '', description: '' })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isCreatingCategory || !newCategory.name.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingCategory ? 'Creando...' : 'Crear Categoría'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Imágenes
          </label>

          {/* Upload Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => imagesInputRef.current?.click()}
              disabled={isUploadingImages}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {isUploadingImages ? 'Subiendo...' : 'Subir Imágenes'}
            </button>
            <input
              ref={imagesInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUploadImages}
              className="hidden"
            />
          </div>

          {/* Image Preview Gallery */}
          {product.images && Array.isArray(product.images) && product.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {product.images.map((imageUrl: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                    {imageUrl}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Manual URL Input (optional) */}
          <div className="mt-4">
            <label className="block text-xs text-gray-600 mb-2">
              O agregar URL manualmente (opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addImageUrl((e.target as HTMLInputElement).value)
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  if (input?.value) {
                    addImageUrl(input.value)
                    input.value = ''
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.featured}
              onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold text-gray-700">Destacado</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.active}
              onChange={(e) => setProduct({ ...product, active: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold text-gray-700">Activo</span>
          </label>
        </div>
      </div>
    </div>
  )
}

