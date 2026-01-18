'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>({
    title: '',
    slug: '',
    excerpt: '',
    contentRichText: null,
    coverImageUrl: '',
    seoTitle: '',
    seoDescription: '',
    status: 'DRAFT',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (params.id && params.id !== 'new') {
      fetch(`/api/admin/posts/${params.id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(() => {})
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [params.id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const url = params.id === 'new'
        ? '/api/admin/posts'
        : `/api/admin/posts/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          publishedAt: post.status === 'PUBLISHED' && !post.publishedAt
            ? new Date().toISOString()
            : post.publishedAt,
        }),
      })

      if (response.ok) {
        const savedPost = await response.json()
        alert('Noticia guardada correctamente')
        router.push('/admin/posts')
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
            href="/admin/posts"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {params.id === 'new' ? 'Nueva Noticia' : 'Editar Noticia'}
            </h1>
          </div>
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
            Título *
          </label>
          <input
            type="text"
            required
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            required
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="url-amigable"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Extracto
          </label>
          <textarea
            value={post.excerpt || ''}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Imagen de Portada (URL)
          </label>
          <input
            type="url"
            value={post.coverImageUrl || ''}
            onChange={(e) => setPost({ ...post, coverImageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contenido
          </label>
          <textarea
            value={post.contentRichText ? JSON.stringify(post.contentRichText, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setPost({ ...post, contentRichText: parsed })
              } catch {
                // Invalid JSON, keep as is
              }
            }}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder='{"type":"doc","content":[...]}'
          />
          <p className="text-xs text-gray-500 mt-1">
            JSON del editor TipTap (por ahora manual, implementar editor visual después)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            value={post.seoTitle || ''}
            onChange={(e) => setPost({ ...post, seoTitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SEO Description
          </label>
          <textarea
            value={post.seoDescription || ''}
            onChange={(e) => setPost({ ...post, seoDescription: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={post.status}
            onChange={(e) => setPost({ ...post, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicada</option>
          </select>
        </div>
      </div>
    </div>
  )
}

