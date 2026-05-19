'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ChevronRight } from 'lucide-react'

export function CuradorHeader() {
  return (
    <header className="sticky top-0 z-10 flex flex-col justify-center border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          {/* Migas de pan y SidebarTrigger integrado sutilmente para móviles si es necesario */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-gray-500">
            <SidebarTrigger className="-ml-2 h-5 w-5 text-gray-400 md:hidden" />
            <span className="cursor-pointer transition-colors hover:text-gray-700">
              Nueva carga
            </span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-gray-900">Nuevo documento</span>
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#00315C]">
            Ingesta y clasificación avanzada
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 border-gray-300 px-6 font-medium text-gray-600 hover:bg-gray-50"
          >
            Guardar borrador
          </Button>
          <Button className="h-10 bg-[#003D6F] px-6 font-medium text-white shadow-sm hover:bg-[#00315C]">
            Publicar documento
          </Button>
        </div>
      </div>
    </header>
  )
}
