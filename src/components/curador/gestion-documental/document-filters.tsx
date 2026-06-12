'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DOCUMENT_FILTER_TABS, type DocumentFilterId } from '@/lib/document-status'

export function DocumentFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeTab = (searchParams.get('estado') as DocumentFilterId) || 'todos'
  const tiempo = searchParams.get('tiempo') || '30d'
  const busquedaParam = searchParams.get('busqueda') || ''

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '' || (key === 'estado' && value === 'todos')) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      if (!updates.page) {
        params.delete('page')
      }

      const query = params.toString()
      startTransition(() => {
        router.push(query ? `?${query}` : '/curador/gestion-documental')
      })
    },
    [router, searchParams],
  )

  const handleTabChange = (tabId: DocumentFilterId) => {
    updateParams({ estado: tabId === 'todos' ? null : tabId })
  }

  const handleTiempoChange = (value: string) => {
    updateParams({ tiempo: value === '30d' ? null : value })
  }

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0">
        {DOCUMENT_FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#0F1D30] text-white'
                : 'bg-transparent text-[#404551] hover:bg-[#F3F4F6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <BusquedaFilter
          key={busquedaParam}
          initialValue={busquedaParam}
          onSubmit={(value) => updateParams({ busqueda: value.trim() || null })}
        />

        <Select value={tiempo} onValueChange={handleTiempoChange}>
          <SelectTrigger className="h-9 w-[180px] border-[#C1C7D2] bg-white text-[13px] font-semibold text-[#404551] focus:ring-[#005496]">
            <SelectValue placeholder="Rango de fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 border-[#C1C7D2] bg-white text-[13px] font-semibold text-[#404551] hover:bg-[#F3F4F6]"
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
    </div>
  )
}

function BusquedaFilter({
  initialValue,
  onSubmit,
}: {
  initialValue: string
  onSubmit: (value: string) => void
}) {
  const [busqueda, setBusqueda] = useState(initialValue)

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(busqueda)
  }

  return (
    <form onSubmit={handleSearchSubmit} className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
      <Input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por título..."
        className="h-9 w-[220px] border-[#C1C7D2] bg-white pl-9 text-[13px] font-medium"
      />
    </form>
  )
}
