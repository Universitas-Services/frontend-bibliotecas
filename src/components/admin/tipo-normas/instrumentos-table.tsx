'use client'

import { useState } from 'react'
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InstrumentoLegal } from './mock-data'

interface InstrumentosTableProps {
  initialInstrumentos: InstrumentoLegal[]
}

export function InstrumentosTable({ initialInstrumentos }: InstrumentosTableProps) {
  const [instrumentos, setInstrumentos] = useState<InstrumentoLegal[]>(initialInstrumentos)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleStatus = (id: string) => {
    setInstrumentos(
      instrumentos.map((inst) => (inst.id === id ? { ...inst, activo: !inst.activo } : inst)),
    )
  }

  const filteredInstrumentos = instrumentos.filter(
    (inst) =>
      inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b bg-white p-4 sm:flex-row sm:items-center sm:p-6">
        <h2 className="text-lg font-bold text-slate-800">Instrumentos registrados</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar..."
            className="w-full border-slate-200 bg-slate-50 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="border-b">
              <TableHead className="py-4 font-semibold text-slate-500">
                Nombre del Instrumento
              </TableHead>
              <TableHead className="w-1/2 py-4 font-semibold text-slate-500">Descripción</TableHead>
              <TableHead className="py-4 text-center font-semibold text-slate-500">
                Estado
              </TableHead>
              <TableHead className="py-4 text-center font-semibold text-slate-500">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstrumentos.map((inst) => (
              <TableRow
                key={inst.id}
                className="border-b border-slate-100 transition-colors hover:bg-slate-50"
              >
                <TableCell className="py-5 align-top font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
                    {inst.nombre}
                  </div>
                </TableCell>
                <TableCell className="py-5 align-top text-sm leading-relaxed text-slate-600">
                  {inst.descripcion}
                </TableCell>
                <TableCell className="py-5 text-center align-top">
                  <Switch
                    checked={inst.activo}
                    onCheckedChange={() => toggleStatus(inst.id)}
                    className={inst.activo ? 'data-[state=checked]:bg-green-500' : ''}
                  />
                </TableCell>
                <TableCell className="py-5 text-center align-top">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 border border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 border border-transparent text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredInstrumentos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  No se encontraron instrumentos legales.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-auto flex flex-col items-center justify-between gap-4 border-t bg-slate-50 p-4 text-sm text-slate-600 sm:flex-row">
        <div>
          Mostrando {filteredInstrumentos.length} de {instrumentos.length} instrumentos
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 bg-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 bg-[#0f3b68] text-white hover:bg-[#0a2847]"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            3
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            4
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 bg-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
