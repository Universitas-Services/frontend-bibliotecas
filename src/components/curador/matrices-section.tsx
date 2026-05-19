import { Search, Link as LinkIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function MatricesSection() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
      {/* Matriz A */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-[#F8FAFC] p-3 text-center text-sm font-medium text-[#005496]">
          Matriz A — formación
        </div>
        <div className="flex-1 space-y-4 p-4">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
            />
            <Input
              placeholder="Buscar elemento en matriz de formación..."
              className="h-11 border-gray-300 bg-white pl-9"
            />
          </div>

          <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-[#F1F5F9] p-3">
            <div className="shrink-0 rounded bg-[#D4E4FA] p-2 text-[#005496]">
              <LinkIcon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs leading-tight font-semibold text-gray-900">
                Módulo de Integridad Académica v4.2
              </p>
              <p className="mt-1 text-[10px] text-gray-500">Última vinculación: hace 2 días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz B */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-[#F8FAFC] p-3 text-center text-sm font-medium text-[#005496]">
          Matriz B — Ágora
        </div>
        <div className="flex-1 space-y-4 p-4">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
            />
            <Input
              placeholder="Buscar elemento en matriz de artículos..."
              className="h-11 border-gray-300 bg-white pl-9"
            />
          </div>

          <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-[#F1F5F9] p-3">
            <div className="shrink-0 rounded bg-[#D4E4FA] p-2 text-[#005496]">
              <LinkIcon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs leading-tight font-semibold text-gray-900">
                Módulo de Integridad Académica v4.2
              </p>
              <p className="mt-1 text-[10px] text-gray-500">Última vinculación: hace 2 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
