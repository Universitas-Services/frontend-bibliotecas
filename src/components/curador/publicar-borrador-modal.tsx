'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { publicarBorradorAction } from '@/app/actions/curador-documents'
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

type PublicarBorradorModalProps = {
  documentId: string
  documentTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PublicarBorradorModal({
  documentId,
  documentTitle,
  open,
  onOpenChange,
}: PublicarBorradorModalProps) {
  const router = useRouter()
  const [comentarios, setComentarios] = useState('')
  const [isPending, startTransition] = useTransition()

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publicarBorradorAction(documentId, {
        comentarios: comentarios.trim() || undefined,
      })

      if (!result.success) {
        toast.error('Error al publicar el borrador', {
          description: [result.error, result.details].filter(Boolean).join('\n'),
        })
        return
      }

      toast.success('Borrador enviado a revisión correctamente.')
      setComentarios('')
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Publicar borrador</DialogTitle>
          <DialogDescription>
            El borrador &quot;{documentTitle}&quot; pasará a estado pendiente de revisión.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-[#6B7280]">
            Asegúrese de haber completado la clasificación y metadatos antes de publicar.{' '}
            <Link
              href={`/curador/nueva-carga?edit=${documentId}`}
              className="font-semibold text-[#005496] hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Editar borrador
            </Link>
          </p>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0F1D30]">
              Comentarios para el revisor (opcional)
            </label>
            <Textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Ej: Documento listo para revisión final..."
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
            className="bg-[#005496] hover:bg-[#00315C]"
            onClick={handlePublish}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              'Publicar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
