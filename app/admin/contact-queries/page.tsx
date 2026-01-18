'use client'

import { useEffect, useState } from 'react'
import { HelpCircle, ShoppingBag, Users, Package } from 'lucide-react'

type TabType = 'all' | 'queries' | 'orders' | 'leads'

export default function AdminContactQueriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [queries, setQueries] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/contact-queries').then(res => res.json()).then(data => Array.isArray(data) ? data : []).catch(() => []),
      fetch('/api/admin/orders').then(res => res.json()).then(data => Array.isArray(data) ? data : []).catch(() => []),
      fetch('/api/admin/leads').then(res => res.json()).then(data => Array.isArray(data) ? data : []).catch(() => []),
    ]).then(([queriesData, ordersData, leadsData]) => {
      setQueries(Array.isArray(queriesData) ? queriesData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setLeads(Array.isArray(leadsData) ? leadsData : [])
      setIsLoading(false)
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800'
      case 'CONTACTED':
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'RESOLVED':
      case 'DONE':
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'ARCHIVED':
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAllItems = () => {
    const all: any[] = []
    const safeQueries = Array.isArray(queries) ? queries : []
    const safeOrders = Array.isArray(orders) ? orders : []
    const safeLeads = Array.isArray(leads) ? leads : []
    
    safeQueries.forEach(q => {
      all.push({
        ...q,
        type: 'query',
        typeLabel: 'Consulta',
        icon: HelpCircle,
      })
    })
    
    safeOrders.forEach(o => {
      all.push({
        ...o,
        type: 'order',
        typeLabel: 'Pedido',
        icon: ShoppingBag,
        name: o.customerName,
      })
    })
    
    safeLeads.forEach(l => {
      all.push({
        ...l,
        type: 'lead',
        typeLabel: 'Lead Mayorista',
        icon: Users,
      })
    })
    
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getFilteredItems = () => {
    const safeQueries = Array.isArray(queries) ? queries : []
    const safeOrders = Array.isArray(orders) ? orders : []
    const safeLeads = Array.isArray(leads) ? leads : []
    
    if (activeTab === 'queries') return safeQueries.map(q => ({ ...q, type: 'query', typeLabel: 'Consulta', icon: HelpCircle }))
    if (activeTab === 'orders') return safeOrders.map(o => ({ ...o, type: 'order', typeLabel: 'Pedido', icon: ShoppingBag, name: o.customerName }))
    if (activeTab === 'leads') return safeLeads.map(l => ({ ...l, type: 'lead', typeLabel: 'Lead Mayorista', icon: Users }))
    return getAllItems()
  }

  const items = getFilteredItems() || []

  if (isLoading) {
    return <div className="text-gray-600">Cargando...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Consultas y Formularios</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Todos ({(Array.isArray(queries) ? queries.length : 0) + (Array.isArray(orders) ? orders.length : 0) + (Array.isArray(leads) ? leads.length : 0)})
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'queries'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Consultas ({Array.isArray(queries) ? queries.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pedidos ({Array.isArray(orders) ? orders.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'leads'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Leads Mayoristas ({Array.isArray(leads) ? leads.length : 0})
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono/WhatsApp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa/Información</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensaje/Detalles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => {
                const Icon = item.icon || HelpCircle
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-medium text-gray-700">{item.typeLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name || item.customerName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.phone || item.whatsapp || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.company || item.companyName || item.type === 'order' ? `$${item.total?.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {item.message || item.notes || (item.items ? `${Array.isArray(item.items) ? item.items.length : 0} productos` : '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No hay formularios aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

