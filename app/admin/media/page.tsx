'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

export default function AdminMediaPage() {
  const [files, setFiles] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)

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
          setFiles(prev => [uploadedFile, ...prev])
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir archivo')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Media</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          Subir Archivo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {isUploading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Subiendo archivos...</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => (
          <div key={file.id} className="relative group">
            <img
              src={file.url}
              alt={file.alt || 'Media'}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                onClick={() => navigator.clipboard.writeText(file.url)}
                className="text-white text-sm px-2 py-1 bg-primary-600 rounded"
              >
                Copiar URL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

