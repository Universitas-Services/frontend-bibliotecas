'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2 } from 'lucide-react'

import { hardDeleteDocumentAction } from '@/app/actions/admin-documents'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { toUserFacingMessage, USER_MSG } from '@/lib/user-messages'

const CONFIRMATION_TEXT = 'ELIMINAR'

type AdminHardDeleteDialogProps = {
  documentId: string
  documentTitle: string
}

export function AdminHardDeleteDialog({ documentId, documentTitle }: AdminHardDeleteDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [isPending, startTransition] = useTransition()

  const canConfirm = confirmation.trim().toUpperCase() === CONFIRMATION_TEXT

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setConfirmation('')
    }
  }

  const handleDelete = () => {
    if (!canConfirm) return

    startTransition(async () => {
      const result = await hardDeleteDocumentAction(documentId)

      if (!result.success) {
        toastError(
          USER_MSG.error.hardDeleteDocument,
          toUserFacingMessage(result.error, USER_MSG.error.hardDeleteDocument),
        )
        return
      }

      toastSuccess(result.message || USER_MSG.success.documentHardDeleted)
      setOpen(false)
      setConfirmation('')
      router.push('/admin/gestion-documental')
      router.refresh()
    })
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/60 p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-red-900">Zona de peligro</h3>
          <p className="mt-1 text-sm leading-relaxed text-red-800/90">
            Elimina de forma <strong>permanente e irreversible</strong> el PDF principal, la gaceta
            (si existe), el registro en base de datos, notas y favoritos vinculados.
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Eliminar documento permanentemente
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar permanentemente este documento?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-1 text-left text-sm text-slate-600">
                <p>
                  Está a punto de destruir el documento{' '}
                  <span className="font-semibold text-slate-900">{documentTitle}</span>. Esta acción
                  no se puede deshacer.
                </p>
                <p>
                  Para confirmar, escriba <strong>{CONFIRMATION_TEXT}</strong> en el campo inferior.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="hard-delete-confirmation">Confirmación</Label>
            <Input
              id="hard-delete-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={CONFIRMATION_TEXT}
              autoComplete="off"
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              type="button"
              disabled={!canConfirm || isPending}
              onClick={handleDelete}
            >
              {isPending ? 'Eliminando...' : 'Eliminar permanentemente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
