'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DOCUMENT_FILTER_TABS } from '@/lib/document-status'
import { Filter } from 'lucide-react'
import { useState } from 'react'

export function DocumentFilters() {
  const [activeTab, setActiveTab] = useState('todos')

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0">
        {DOCUMENT_FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      <div className="flex items-center gap-3">
        <Select defaultValue="30d">
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
          variant="outline"
          className="h-9 gap-2 border-[#C1C7D2] bg-white text-[13px] font-semibold text-[#404551] hover:bg-[#F3F4F6]"
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
    </div>
  )
}
