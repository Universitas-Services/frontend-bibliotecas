'use client'

import { useState } from 'react'
import { CheckSquare, Loader2, XSquare } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'
import type { SugerenciaPendiente } from '@/lib/types/taxonomia'

type PendientesTableProps = {
  title: string
  itemLabel: string
  pendientes: SugerenciaPendiente[]
  onApprove: (id: string) => Promise<{ success: true } | { success: false; error: string }>
  onReject: (id: string) => Promise<{ success: true } | { success: false; error: string }>
  onResolved?: () => void
}

export function PendientesTable({
  title,
  itemLabel,
  pendientes,
  onApprove,
  onReject,
  onResolved,
}: PendientesTableProps) {
  const [busyId, setBusyId] = useState<string | null>(null)

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setBusyId(id)
    try {
      const result = action === 'approve' ? await onApprove(id) : await onReject(id)

      if (result.success) {
        toastSuccess(
          action === 'approve'
            ? USER_MSG.success.sugerenciaAprobada
            : USER_MSG.success.sugerenciaRechazada,
        )
        onResolved?.()
      } else {
        toastError(
          action === 'approve' ? USER_MSG.error.approveSugerencia : USER_MSG.error.rejectSugerencia,
          result.error,
        )
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-6">
        <h2 className="text-lg font-bold text-[#00315C]">{title}</h2>
        <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
          {pendientes.length} pendiente{pendientes.length === 1 ? '' : 's'}
        </Badge>
      </div>

      {pendientes.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-gray-500">
          No hay sugerencias pendientes de revisión.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-gray-600">{itemLabel}</TableHead>
              <TableHead className="font-semibold text-gray-600">Usuario proponente</TableHead>
              <TableHead className="text-center font-semibold text-gray-600">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendientes.map((item) => {
              const isBusy = busyId === item.id
              const proponente = item.sugeridoPor?.email || 'Usuario desconocido'
              const rol = item.sugeridoPor?.role || '—'

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-gray-900">{item.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{proponente}</span>
                      <span className="text-xs text-gray-500">{rol}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleAction(item.id, 'approve')}
                        className="text-green-600 transition-colors hover:text-green-800 disabled:opacity-50"
                        aria-label={`Aprobar ${item.nombre}`}
                      >
                        {isBusy ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckSquare className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleAction(item.id, 'reject')}
                        className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                        aria-label={`Rechazar ${item.nombre}`}
                      >
                        <XSquare className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
