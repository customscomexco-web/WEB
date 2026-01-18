'use client'

import { useEffect, useState, useRef } from 'react'
import { Save, Upload, X } from 'lucide-react'

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<any>({
    siteName: '',
    logoUrl: '',
    primaryColor: '#006d8c',
    whatsappNumber: '',
    calendlyUrl: '',
    address: '',
    phone: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            ...data,
            logoUrl: data.logoUrl || '',
            socialLinks: data.socialLinks || {
              facebook: '',
              instagram: '',
              linkedin: '',
            },
          })
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const uploadedFile = await response.json()
        setSettings({ ...settings, logoUrl: uploadedFile.url })
      } else {
        alert('Error al subir el logo')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Error al subir el logo')
    } finally {
      setIsUploadingLogo(false)
      if (logoInputRef.current) {
        logoInputRef.current.value = ''
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Configuración guardada correctamente')
      } else {
        alert('Error al guardar la configuración')
      }
    } catch (error) {
      alert('Error al guardar la configuración')
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
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sitio</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Guardar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del Sitio
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Logo del Sitio
          </label>
          <div className="space-y-3">
            {settings.logoUrl && (
              <div className="relative inline-block">
                <img
                  src={settings.logoUrl}
                  alt="Logo actual"
                  className="h-24 object-contain border border-gray-200 rounded-lg p-2 bg-gray-50"
                />
                <button
                  onClick={() => setSettings({ ...settings, logoUrl: '' })}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {settings.logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadLogo}
                className="hidden"
              />
              {isUploadingLogo && (
                <span className="text-sm text-gray-600">Subiendo...</span>
              )}
            </div>
            {settings.logoUrl && (
              <input
                type="text"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="URL del logo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Color Primario
          </label>
          <input
            type="color"
            value={settings.primaryColor}
            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
            className="w-20 h-10 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            WhatsApp
          </label>
          <input
            type="text"
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            placeholder="+5491112345678"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="text"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dirección
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Redes Sociales
          </label>
          <div className="space-y-3">
            <input
              type="url"
              value={settings.socialLinks?.facebook || ''}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, facebook: e.target.value },
              })}
              placeholder="Facebook URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
            <input
              type="url"
              value={settings.socialLinks?.instagram || ''}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, instagram: e.target.value },
              })}
              placeholder="Instagram URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
            <input
              type="url"
              value={settings.socialLinks?.linkedin || ''}
              onChange={(e) => setSettings({
                ...settings,
                socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
              })}
              placeholder="LinkedIn URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

