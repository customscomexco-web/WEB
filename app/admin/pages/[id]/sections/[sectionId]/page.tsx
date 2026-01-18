'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditSectionPage() {
  const params = useParams()
  const router = useRouter()
  const [section, setSection] = useState<any>({
    type: 'HERO',
    content: {},
    visible: true,
    order: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (params.sectionId && params.sectionId !== 'new') {
      fetch(`/api/admin/sections/${params.sectionId}`)
        .then(res => res.json())
        .then(data => setSection(data))
        .catch(() => {})
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [params.sectionId])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const url = params.sectionId === 'new'
        ? '/api/admin/sections'
        : `/api/admin/sections/${params.sectionId}`
      const method = params.sectionId === 'new' ? 'POST' : 'PUT'

      // Prepare body - only include necessary fields
      const body: any = {
        type: section.type,
        content: section.content || {},
        visible: Boolean(section.visible),
        order: parseInt(section.order) || 0,
      }

      if (params.sectionId === 'new') {
        body.pageId = params.id
      }

      console.log('Saving section:', JSON.stringify(body, null, 2))

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        alert('Sección guardada correctamente')
        // Refresh router to clear cache
        router.refresh()
        router.push(`/admin/pages/${params.id}`)
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || 'Error al guardar'
        console.error('Error response:', errorData)
        alert(errorMessage)
      }
    } catch (error: any) {
      console.error('Error saving section:', error)
      const errorMessage = error?.message || 'Error de conexión al guardar'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return

    try {
      const response = await fetch(`/api/admin/sections/${params.sectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Sección eliminada correctamente')
        router.push(`/admin/pages/${params.id}`)
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const updateContent = (key: string, value: any) => {
    setSection({
      ...section,
      content: {
        ...section.content,
        [key]: value,
      },
    })
  }

  const updateNestedContent = (path: string[], value: any) => {
    const newContent = { ...section.content }
    let current: any = newContent
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {}
      current = current[path[i]]
    }
    
    current[path[path.length - 1]] = value
    
    setSection({
      ...section,
      content: newContent,
    })
  }

  const renderSectionEditor = () => {
    switch (section.type) {
      case 'HERO':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={section.content?.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={section.content?.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA Principal - Texto
              </label>
              <input
                type="text"
                value={section.content?.primaryCta?.text || ''}
                onChange={(e) => updateNestedContent(['primaryCta', 'text'], e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA Principal - Link
              </label>
              <input
                type="text"
                value={section.content?.primaryCta?.link || ''}
                onChange={(e) => updateNestedContent(['primaryCta', 'link'], e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA Secundario - Texto
              </label>
              <input
                type="text"
                value={section.content?.secondaryCta?.text || ''}
                onChange={(e) => updateNestedContent(['secondaryCta', 'text'], e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA Secundario - Link
              </label>
              <input
                type="text"
                value={section.content?.secondaryCta?.link || ''}
                onChange={(e) => updateNestedContent(['secondaryCta', 'link'], e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )

      case 'SERVICES_GRID':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={section.content?.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Items (JSON)
              </label>
              <textarea
                value={JSON.stringify(section.content?.items || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    updateContent('items', parsed)
                  } catch {}
                }}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Array de objetos con: title, description, icon
              </p>
            </div>
          </div>
        )

      case 'CTA_BAND':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Texto
              </label>
              <input
                type="text"
                value={section.content?.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA - Texto
              </label>
              <input
                type="text"
                value={section.content?.cta?.text || ''}
                onChange={(e) => updateNestedContent(['cta', 'text'], e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA - Link
              </label>
              <input
                type="text"
                value={section.content?.cta?.link || ''}
                onChange={(e) => updateNestedContent(['cta', 'link'], e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )

      case 'FAQ':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={section.content?.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Items (JSON)
              </label>
              <textarea
                value={JSON.stringify(section.content?.items || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    updateContent('items', parsed)
                  } catch {}
                }}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Array de objetos con: question, answer
              </p>
            </div>
          </div>
        )

      case 'RICH_TEXT':
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contenido HTML
            </label>
            <textarea
              value={section.content?.html || ''}
              onChange={(e) => updateContent('html', e.target.value)}
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>
        )

      default:
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contenido (JSON)
            </label>
            <textarea
              value={JSON.stringify(section.content || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  setSection({ ...section, content: parsed })
                } catch {}
              }}
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>
        )
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
            href={`/admin/pages/${params.id}`}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {params.sectionId === 'new' ? 'Nueva Sección' : 'Editar Sección'}
            </h1>
            <p className="text-gray-600 mt-1">Tipo: {section.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {params.sectionId !== 'new' && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          )}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Sección
          </label>
          <select
            value={section.type}
            onChange={(e) => setSection({ ...section, type: e.target.value, content: {} })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            disabled={params.sectionId !== 'new'}
          >
            <option value="HERO">Hero</option>
            <option value="SERVICES_GRID">Services Grid</option>
            <option value="CTA_BAND">CTA Band</option>
            <option value="FAQ">FAQ</option>
            <option value="TESTIMONIALS">Testimonials</option>
            <option value="RICH_TEXT">Rich Text</option>
            <option value="STATS">Stats</option>
            <option value="IMAGE_TEXT">Image Text</option>
            <option value="CONTACT_BLOCK">Contact Block</option>
            <option value="IMPORTADORA_TEASER">Importadora Teaser</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Orden
          </label>
          <input
            type="number"
            value={section.order || 0}
            onChange={(e) => setSection({ ...section, order: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.visible}
            onChange={(e) => setSection({ ...section, visible: e.target.checked })}
            className="w-4 h-4"
          />
          <label className="text-sm font-semibold text-gray-700">
            Visible
          </label>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Contenido</h3>
          {renderSectionEditor()}
        </div>
      </div>
    </div>
  )
}

