'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'

import {
  createNotaInternaAction,
  deleteNotaInternaAction,
  getNotasByDocumentoAction,
  type NotaInterna,
} from '@/app/actions/notas-internas'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type NotasDrawerProps = {
  documentoId: string
  documentoTitulo: string
  open: boolean
  onOpenChange: (open: boolean) => void
  readOnly?: boolean
}

function getAutorLabel(nota: NotaInterna): string {
  return nota.autorNombre || nota.autor || 'Administrador'
}

function getAutorInitials(nota: NotaInterna): string {
  const name = getAutorLabel(nota)
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'AD'
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

export function NotasDrawer({
  documentoId,
  documentoTitulo,
  open,
  onOpenChange,
  readOnly = false,
}: NotasDrawerProps) {
  const router = useRouter()
  const [notas, setNotas] = useState<NotaInterna[]>([])
  const [contenido, setContenido] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open || !documentoId) return

    async function loadNotas() {
      setLoading(true)
      const result = await getNotasByDocumentoAction(documentoId)
      if (result.success) {
        setNotas(
          [...result.data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.fecha || 0).getTime()
            const dateB = new Date(b.createdAt || b.fecha || 0).getTime()
            return dateB - dateA
          }),
        )
      } else {
        toastError(USER_MSG.error.loadNotes, result.error)
      }
      setLoading(false)
    }

    loadNotas()
  }, [open, documentoId])

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

      setContenido('')
      const reload = await getNotasByDocumentoAction(documentoId)
      if (reload.success) {
        setNotas(
          [...reload.data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.fecha || 0).getTime()
            const dateB = new Date(b.createdAt || b.fecha || 0).getTime()
            return dateB - dateA
          }),
        )
      }
      toastSuccess(USER_MSG.success.noteCreated)
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notas internas</SheetTitle>
          <SheetDescription className="line-clamp-2">{documentoTitulo}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-sm text-[#6B7280]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando notas...
            </div>
          ) : notas.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#6B7280]">
              No hay notas internas para este documento.
            </p>
          ) : (
            notas.map((nota) => (
              <div key={nota.id} className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00315C] text-[11px] font-bold text-white">
                      {getAutorInitials(nota)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F1D30]">{getAutorLabel(nota)}</p>
                      <p className="text-[11px] text-[#6B7280]">
                        {formatFecha(nota.createdAt || nota.fecha)}
                      </p>
                    </div>
                  </div>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(nota.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[#404551]">{nota.contenido}</p>
              </div>
            ))
          )}
        </div>

        {!readOnly && (
          <div className="space-y-3 border-t pt-4">
            <Textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escriba una nota interna para el curador..."
              className="min-h-[100px] resize-none"
            />
            <Button
              className="w-full bg-[#005496] hover:bg-[#00315C]"
              onClick={handleCreate}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Agregar nota'
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
