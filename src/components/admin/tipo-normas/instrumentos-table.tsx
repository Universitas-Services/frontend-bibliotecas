'use client'

import { useState, useEffect } from 'react'
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
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
import { getTiposNormaAction, type TemaPrincipal } from '@/app/actions/temas'
import { getTipoNormaDisplayName } from '@/lib/temas-taxonomy'

interface InstrumentosTableProps {
  temas: TemaPrincipal[]
}

type InstrumentoRow = {
  id: string
  nombre: string
  temaAsociado: string
  documentoAsociado: string
  fecha: string
  activo: boolean
}

export function InstrumentosTable({ temas }: InstrumentosTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [instrumentos, setInstrumentos] = useState<InstrumentoRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAllInstrumentos() {
      setIsLoading(true)
      const allInstrumentos: InstrumentoRow[] = []

      // Extraer todas las subcarpetas con sus referencias
      const subcarpetas = temas.flatMap((tema) =>
        (tema.subcarpetas || []).map((sub) => ({
          subId: sub.id,
          temaNombre: tema.nombre,
          docNombre: sub.tipoNorma,
        })),
      )

      // Por cada subcarpeta, hacer fetch de sus carpetas internas (Tipos de norma)
      await Promise.all(
        subcarpetas.map(async (sub) => {
          try {
            const carpetas = await getTiposNormaAction(sub.subId)
            console.log(`Carpetas de ${sub.docNombre}:`, carpetas)
            carpetas.forEach((c) => {
              allInstrumentos.push({
                id: c.id || String(Math.random()),
                nombre: c.nombreCarpeta || getTipoNormaDisplayName(c) || 'Desconocido',
                temaAsociado: sub.temaNombre || '',
                documentoAsociado: sub.docNombre || '',
                fecha: c.createdAt || '-',
                activo: true,
              })
            })
          } catch (error) {
            console.error(`Error fetching carpetas for ${sub.subId}:`, error)
          }
        }),
      )

      setInstrumentos(allInstrumentos)
      setIsLoading(false)
    }

    fetchAllInstrumentos()
  }, [temas])

  const [localStatus, setLocalStatus] = useState<Record<string, boolean>>({})

  const toggleStatus = (id: string) => {
    setLocalStatus((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : false,
    }))
  }

  const filteredInstrumentos = instrumentos.filter(
    (inst) =>
      (inst.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.temaAsociado || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.documentoAsociado || '').toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b bg-white p-4 sm:flex-row sm:items-center sm:p-6">
        <h2 className="text-lg font-bold text-slate-800">
          Instrumentos registrados (Tipos de norma)
        </h2>
        <div className="relative w-full sm:w-80">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, tema o documento..."
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
              <TableHead className="py-4 font-semibold text-slate-500">Tipo de Norma</TableHead>
              <TableHead className="py-4 font-semibold text-slate-500">Jerarquía</TableHead>
              <TableHead className="py-4 text-center font-semibold text-slate-500">
                Estado
              </TableHead>
              <TableHead className="py-4 text-center font-semibold text-slate-500">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0f3b68]" />
                    <span>Cargando tipos de norma...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredInstrumentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  No se encontraron tipos de norma registrados.
                </TableCell>
              </TableRow>
            ) : (
              filteredInstrumentos.map((inst) => {
                const isActive =
                  localStatus[inst.id] !== undefined ? localStatus[inst.id] : inst.activo
                return (
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
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">{inst.temaAsociado}</span>
                        <span className="text-xs text-slate-500">↳ {inst.documentoAsociado}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-center align-top">
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleStatus(inst.id)}
                        className={isActive ? 'data-[state=checked]:bg-green-500' : ''}
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
                )
              })
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
          <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 bg-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
