'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Upload, X } from 'lucide-react'
import Link from 'next/link'

export default function EditPagePage() {
  const params = useParams()
  const router = useRouter()
  const [page, setPage] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingBackground, setIsUploadingBackground] = useState(false)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/admin/pages/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setPage(data)
          setSections(data.sections || [])
        })
        .catch(() => {})
        .finally(() => setIsLoading(false))
    }
  }, [params.id])

  const handleSave = async () => {
    if (!page) {
      alert('Error: No se pudo cargar la página')
      return
    }

    // Validate required fields
    if (!page.title || page.title.trim() === '') {
      alert('El título es requerido')
      return
    }

    setIsSaving(true)
    try {
      // Only send editable fields with proper values
      const pageDataToSave: any = {
        title: page.title.trim(),
        sections: sections || [],
      }

      // Optional fields - only include if they have values
      if (page.seoTitle !== undefined && page.seoTitle !== null) {
        pageDataToSave.seoTitle = page.seoTitle.trim() || null
      }
      if (page.seoDescription !== undefined && page.seoDescription !== null) {
        pageDataToSave.seoDescription = page.seoDescription.trim() || null
      }
      if (page.ogImageUrl !== undefined && page.ogImageUrl !== null) {
        pageDataToSave.ogImageUrl = page.ogImageUrl || null
      }
      if (page.backgroundImageUrl !== undefined && page.backgroundImageUrl !== null) {
        pageDataToSave.backgroundImageUrl = page.backgroundImageUrl || null
      }
      if (page.published !== undefined) {
        pageDataToSave.published = Boolean(page.published)
      }

      console.log('Saving page data:', pageDataToSave)

      const response = await fetch(`/api/admin/pages/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageDataToSave),
      })

      if (response.ok) {
        alert('Página guardada correctamente')
        // Refresh router to clear cache
        router.refresh()
        router.push('/admin/pages')
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || errorData.details || 'Error al guardar'
        console.error('Save error response:', JSON.stringify(errorData, null, 2))
        console.error('Response status:', response.status)
        console.error('Response statusText:', response.statusText)
        alert(`Error: ${errorMessage}\n\nRevisa la consola para más detalles.`)
      }
    } catch (error: any) {
      console.error('Error saving page:', error)
      console.error('Error stack:', error?.stack)
      const errorMessage = error?.message || 'Error de conexión al guardar'
      alert(`Error de conexión: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSectionVisibility = async (sectionId: string) => {
    const updatedSections = sections.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    )
    setSections(updatedSections)
    
    // Save immediately
    try {
      await fetch(`/api/admin/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSections.find(s => s.id === sectionId)),
      })
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const handleUploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingBackground(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const uploadedFile = await response.json()
        setPage({ ...page, backgroundImageUrl: uploadedFile.url })
        alert('Imagen subida correctamente. Recuerda guardar los cambios.')
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || 'Error al subir la imagen de fondo'
        console.error('Upload error response:', errorData)
        alert(errorMessage)
      }
    } catch (error: any) {
      console.error('Error uploading background:', error)
      const errorMessage = error?.message || 'Error de conexión al subir la imagen'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsUploadingBackground(false)
      if (backgroundInputRef.current) {
        backgroundInputRef.current.value = ''
      }
    }
  }

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newSections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
      newSections[index].order = index
      newSections[newIndex].order = newIndex
      setSections(newSections)
      
      // Save order changes
      try {
        await Promise.all([
          fetch(`/api/admin/sections/${newSections[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: newSections[index].order }),
          }),
          fetch(`/api/admin/sections/${newSections[newIndex].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: newSections[newIndex].order }),
          }),
        ])
      } catch (error) {
        console.error('Error updating section order:', error)
      }
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!page) {
    return <div>Página no encontrada</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Página</h1>
          <p className="text-gray-600 mt-1">{page.title}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Ver Página
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Información General</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={page.title || ''}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={page.seoTitle || ''}
              onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SEO Description
            </label>
            <textarea
              value={page.seoDescription || ''}
              onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imagen de Fondo
            </label>
            <div className="space-y-3">
              {page.backgroundImageUrl && (
                <div className="relative inline-block">
                  <img
                    src={page.backgroundImageUrl}
                    alt="Imagen de fondo actual"
                    className="h-32 w-auto object-cover border border-gray-200 rounded-lg p-2 bg-gray-50"
                  />
                  <button
                    onClick={() => setPage({ ...page, backgroundImageUrl: null })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => backgroundInputRef.current?.click()}
                  disabled={isUploadingBackground}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {page.backgroundImageUrl ? 'Cambiar Imagen de Fondo' : 'Subir Imagen de Fondo'}
                </button>
                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadBackground}
                  className="hidden"
                />
                {isUploadingBackground && (
                  <span className="text-sm text-gray-600">Subiendo...</span>
                )}
              </div>
              {page.backgroundImageUrl && (
                <input
                  type="text"
                  value={page.backgroundImageUrl}
                  onChange={(e) => setPage({ ...page, backgroundImageUrl: e.target.value })}
                  placeholder="URL de la imagen de fondo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={page.published || false}
              onChange={(e) => setPage({ ...page, published: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-semibold text-gray-700">
              Publicada
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Secciones</h2>
          <button
            onClick={() => router.push(`/admin/pages/${params.id}/sections/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Nueva Sección
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">
                    {section.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    Orden: {section.order}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSectionVisibility(section.id)}
                    className={`px-3 py-1 text-xs rounded ${
                      section.visible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {section.visible ? 'Visible' : 'Oculta'}
                  </button>
                  <Link
                    href={`/admin/pages/${params.id}/sections/${section.id}`}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    Editar
                  </Link>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {JSON.stringify(section.content, null, 2).substring(0, 100)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

