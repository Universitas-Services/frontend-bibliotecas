'use client'

import Link from 'next/link'
import { PlusCircle, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NuevoTemaForm() {
  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-sm font-semibold text-slate-800">Nuevo tema principal</h2>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex w-full items-center gap-3">
          <Input placeholder="Ej. Derecho Urbanístico" className="flex-1 bg-white" />
          <Button asChild className="bg-[#0f3b68] text-white hover:bg-[#0a2847]">
            <Link href="/admin/taxonomia/temas/nuevo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear tema
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="bg-white">
            <Download className="h-4 w-4 text-slate-500" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white">
            <Filter className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
        <p className="text-xs font-medium text-slate-500">
          Al crear el tema, este se inyectará automáticamente en el menú desplegable de carga del
          curador.
        </p>
      </div>
    </div>
  )
}
