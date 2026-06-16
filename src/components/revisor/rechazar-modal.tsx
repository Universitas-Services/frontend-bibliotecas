'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { rechazarDocumentoAction } from '@/app/actions/workflows'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

type RechazarModalProps = {
  documentId: string
  documentTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RechazarModal({
  documentId,
  documentTitle,
  open,
  onOpenChange,
}: RechazarModalProps) {
  const router = useRouter()
  const [motivo, setMotivo] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleRechazar = async () => {
    if (motivo.trim().length < 10) {
      toast.error('El motivo de rechazo debe tener al menos 10 caracteres.')
      return
    }

    setIsPending(true)
    const result = await rechazarDocumentoAction(documentId, motivo)
    setIsPending(false)

    if (!result.success) {
      toast.error('Error al rechazar el documento', {
        description: [result.error, result.details].filter(Boolean).join('\n'),
      })
      return
    }

    toast.success('Documento rechazado', {
      description: 'El documento ha sido devuelto al curador para sus correcciones.',
    })
    setMotivo('')
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rechazar documento</DialogTitle>
          <DialogDescription>
            Por favor, indique el motivo por el cual se rechaza el documento &quot;{documentTitle}
            &quot;. Este motivo será visible para el curador.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0F1D30]">
              Motivo de rechazo (obligatorio)
            </label>
            <Textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Especifique qué debe corregir el curador..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isPending}
            className="bg-[#DC2626] hover:bg-[#B91C1C]"
            onClick={handleRechazar}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rechazando...
              </>
            ) : (
              'Confirmar rechazo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
