'use client'

import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function NuevoInstrumentoForm() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">Nuevo instrumento</h2>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Nombre del instrumento
          </label>
          <Input placeholder="Ej. Providencia" className="border-slate-200 bg-slate-50" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Descripción corta</label>
          <Textarea
            placeholder="Describa el propósito y alcance jurídico de este tipo de norma..."
            className="h-28 resize-none border-slate-200 bg-slate-50"
          />
        </div>
      </div>

      <div className="rounded-r-md border-l-4 border-[#0f3b68] bg-[#f5f7ff] p-4 text-sm leading-relaxed text-slate-600">
        Los instrumentos creados alimentarán automáticamente el desplegable de ingesta del curador y
        las facetas del buscador público.
      </div>

      <Button className="w-full bg-[#0f3b68] text-white hover:bg-[#0a2847]">
        <Save className="mr-2 h-4 w-4" />
        Crear tipo de norma
      </Button>
    </div>
  )
}
