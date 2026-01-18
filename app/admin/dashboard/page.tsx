'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Users, FileText, Package, HelpCircle } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    newOrders: 0,
    newLeads: 0,
    newQueries: 0,
    draftPosts: 0,
    activeProducts: 0,
  })

  useEffect(() => {
    // Fetch stats
    Promise.all([
      fetch('/api/admin/orders?status=NEW').then(res => res.json()).catch(() => ({ count: 0 })),
      fetch('/api/admin/leads?status=NEW').then(res => res.json()).catch(() => ({ count: 0 })),
      fetch('/api/admin/contact-queries').then(res => res.json()).then(data => ({ count: Array.isArray(data) ? data.filter((q: any) => q.status === 'NEW').length : 0 })).catch(() => ({ count: 0 })),
      fetch('/api/admin/posts?status=DRAFT').then(res => res.json()).catch(() => ({ count: 0 })),
      fetch('/api/admin/products?active=true').then(res => res.json()).catch(() => ({ count: 0 })),
    ]).then(([orders, leads, queries, posts, products]) => {
      setStats({
        newOrders: orders.count || 0,
        newLeads: leads.count || 0,
        newQueries: queries.count || 0,
        draftPosts: posts.count || 0,
        activeProducts: products.count || 0,
      })
    })
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pedidos Nuevos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newOrders}</p>
            </div>
            <ShoppingBag className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Leads Nuevos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newLeads}</p>
            </div>
            <Users className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Consultas Nuevas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newQueries}</p>
            </div>
            <HelpCircle className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Borradores</p>
              <p className="text-3xl font-bold text-gray-900">{stats.draftPosts}</p>
            </div>
            <FileText className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Productos Activos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
            </div>
            <Package className="w-12 h-12 text-primary-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

