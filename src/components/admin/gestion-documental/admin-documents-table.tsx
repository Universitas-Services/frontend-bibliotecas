'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FileText, ClipboardList, FileCheck, AlertTriangle } from 'lucide-react'

import type { AdminDocumentItem } from '@/app/actions/admin-documents'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { mapBackendStatus, DOCUMENT_STATUS_STYLES } from '@/lib/document-status'

type CuradorOption = {
  id: string
  nombre: string
  email?: string
}

type AdminDocumentsTableProps = {
  documents: AdminDocumentItem[]
  curadores: CuradorOption[]
  selectedCuradorId?: string
  conNotas: boolean
  page: number
  totalPages: number
  total: number
}

const STATUS_ICONS = {
  publicado: FileCheck,
  'en-revision': ClipboardList,
  borrador: FileText,
  rechazado: AlertTriangle,
} as const

export function AdminDocumentsTable({
  documents,
  curadores,
  selectedCuradorId,
  conNotas,
  page,
  totalPages,
  total,
}: AdminDocumentsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    if (!updates.page) params.delete('page')
    const query = params.toString()
    startTransition(() => {
      router.push(query ? `?${query}` : '/admin/gestion-documental')
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Curador</Label>
          <Select
            value={selectedCuradorId || 'todos'}
            onValueChange={(value) =>
              updateFilters({ curadorId: value === 'todos' ? null : value })
            }
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Todos los curadores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los curadores</SelectItem>
              {curadores.map((curador) => (
                <SelectItem key={curador.id} value={curador.id}>
                  {curador.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="con-notas"
            checked={conNotas}
            onCheckedChange={(checked) => updateFilters({ conNotas: checked ? 'true' : null })}
          />
          <Label htmlFor="con-notas" className="text-sm font-medium text-slate-700">
            Solo con notas
          </Label>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-sm font-medium text-slate-700">
            No hay documentos subidos por curadores con estos filtros.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => {
            const status = mapBackendStatus(doc.estado)
            const styles = DOCUMENT_STATUS_STYLES[status]
            const Icon = STATUS_ICONS[status]

            return (
              <div
                key={doc.id}
                className="overflow-hidden rounded-xl border border-[#C1C7D2] bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#E5E7FF]">
                      <Icon className="h-5 w-5 text-[#005496]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-[15px] leading-snug font-bold text-[#0F1D30]">
                        {doc.titulo}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${styles.tableStatusColor}`}
                        >
                          {styles.label}
                        </span>
                        {doc.notasCount > 0 && (
                          <span className="rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[10px] font-bold text-[#D97706]">
                            {doc.notasCount} nota{doc.notasCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] text-[#6B7280]">
                        {doc.curadorNombre || 'Curador no asignado'}
                        {doc.curadorEmail ? ` · ${doc.curadorEmail}` : ''}
                        {doc.tema ? ` · ${doc.tema}` : ''}
                      </p>
                      {doc.ultimaNota && (
                        <p className="mt-1 line-clamp-1 text-[12px] text-[#9CA3AF]">
                          Última nota: {doc.ultimaNota}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full shrink-0 bg-[#005496] hover:bg-[#00315C] md:w-auto md:justify-self-end"
                  >
                    <Link href={`/admin/gestion-documental/${doc.id}`}>Revisar documento</Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {total > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Página {page} de {totalPages} ({total} documentos)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateFilters({ page: String(page - 1) })}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateFilters({ page: String(page + 1) })}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
