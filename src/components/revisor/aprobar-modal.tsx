'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'
import { aprobarDocumentoAction } from '@/app/actions/workflows'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

type AprobarModalProps = {
  documentId: string
  documentTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AprobarModal({ documentId, documentTitle, open, onOpenChange }: AprobarModalProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleAprobar = async () => {
    setIsPending(true)
    const result = await aprobarDocumentoAction(documentId)
    setIsPending(false)

    if (!result.success) {
      toastError(
        USER_MSG.error.approveDocument,
        [result.error, result.details].filter(Boolean).join('\n'),
      )
      return
    }

    toastSuccess(USER_MSG.success.documentPublishedRevisor)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aprobar documento</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea aprobar el documento &quot;{documentTitle}&quot;? El documento
            pasará a estado publicado.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isPending}
            className="bg-[#16A34A] hover:bg-[#15803D]"
            onClick={handleAprobar}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aprobando...
              </>
            ) : (
              'Confirmar publicación'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
