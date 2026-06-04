'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { TemaPrincipal } from '@/app/actions/temas'

interface TiposDocumentoTableProps {
  temas: TemaPrincipal[]
}

export function TiposDocumentoTable({ temas }: TiposDocumentoTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Flatten the array of Tipos de Documento from all Temas
  const tiposDocumento = temas.flatMap((tema) =>
    (tema.subcarpetas || []).map((sub) => ({
      id: sub.id,
      nombreTema: tema.nombre,
      tipoNorma: sub.tipoNorma,
      fecha: sub.createdAt || '-',
    })),
  )

  const filteredItems = tiposDocumento.filter(
    (item) =>
      item.tipoNorma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nombreTema.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 border-b bg-white p-4 sm:flex-row sm:items-center sm:p-6">
        <h2 className="text-lg font-bold text-slate-800">Tipos de documentos registrados</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o tema..."
            className="w-full border-slate-200 bg-slate-50 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="border-b">
              <TableHead className="py-4 font-semibold text-slate-500">Tipo de Documento</TableHead>
              <TableHead className="py-4 font-semibold text-slate-500">Tema Principal</TableHead>
              <TableHead className="py-4 font-semibold text-slate-500">Fecha creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <TableCell className="py-4 font-medium text-slate-800">{item.tipoNorma}</TableCell>
                <TableCell className="py-4 text-slate-600">{item.nombreTema}</TableCell>
                <TableCell className="py-4 text-slate-500">
                  {item.fecha !== '-' ? new Date(item.fecha).toLocaleDateString() : '-'}
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                  No se encontraron tipos de documentos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
