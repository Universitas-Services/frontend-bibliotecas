'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'

import {
  createNotaInternaAction,
  deleteNotaInternaAction,
  type NotaInterna,
} from '@/app/actions/notas-internas'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type AdminNotasPanelProps = {
  documentoId: string
  initialNotas: NotaInterna[]
}

function getAutorLabel(nota: NotaInterna): string {
  return nota.autorNombre || nota.autor || 'Administrador'
}

function formatFecha(fecha?: string): string {
  if (!fecha) return 'Sin fecha'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminNotasPanel({ documentoId, initialNotas }: AdminNotasPanelProps) {
  const router = useRouter()
  const [notas, setNotas] = useState(
    [...initialNotas].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.fecha || 0).getTime()
      const dateB = new Date(b.createdAt || b.fecha || 0).getTime()
      return dateB - dateA
    }),
  )
  const [contenido, setContenido] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleCreate = () => {
    const texto = contenido.trim()
    if (!texto) {
      toastError(USER_MSG.validation.noteContent)
      return
    }

    startTransition(async () => {
      const result = await createNotaInternaAction({ documentoId, contenido: texto })
      if (!result.success) {
        toastError(USER_MSG.error.createNote, result.error)
        return
      }

      const nuevaNota: NotaInterna = result.data || {
        id: `temp-${Date.now()}`,
        documentoId,
        contenido: texto,
        createdAt: new Date().toISOString(),
        autorNombre: 'Administrador',
      }

      setNotas((prev) => [nuevaNota, ...prev])
      setContenido('')
      toastSuccess(USER_MSG.success.noteSent)
      router.refresh()
    })
  }

  const handleDelete = (notaId: string) => {
    const confirmed = window.confirm('¿Eliminar esta nota interna?')
    if (!confirmed) return

    startTransition(async () => {
      const result = await deleteNotaInternaAction(notaId)
      if (!result.success) {
        toastError(USER_MSG.error.deleteNote, result.error)
        return
      }

      setNotas((prev) => prev.filter((n) => n.id !== notaId))
      toastSuccess(USER_MSG.success.noteDeleted)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-[18px] font-bold text-[#00315C]">Nueva nota para el curador</h3>
        <p className="mb-4 text-sm text-[#6B7280]">
          Indique los ajustes necesarios. El curador verá esta nota en Correcciones pendientes.
        </p>
        <Textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Ej: Verificar el artículo 12, falta la fecha de promulgación en metadatos..."
          className="min-h-[120px] resize-none"
        />
        <Button
          className="mt-4 bg-[#005496] hover:bg-[#00315C]"
          onClick={handleCreate}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar nota al curador'
          )}
        </Button>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 shadow-sm">
        <h3 className="mb-4 text-[18px] font-bold text-[#0F1D30]">
          Notas enviadas ({notas.length})
        </h3>

        {notas.length === 0 ? (
          <p className="text-sm text-[#6B7280]">Aún no hay notas para este documento.</p>
        ) : (
          <div className="space-y-4">
            {notas.map((nota) => (
              <div key={nota.id} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#0F1D30]">{getAutorLabel(nota)}</p>
                    <p className="text-[11px] text-[#6B7280]">
                      {formatFecha(nota.createdAt || nota.fecha)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(nota.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-[#404551]">{nota.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
