'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { publicarBorradorAction } from '@/app/actions/curador-documents'
import { getDocumentByIdAction } from '@/app/actions/documents'
import { getMetadataByDocumentIdAction } from '@/app/actions/metadatas'
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

function readCategoriaIds(documento: Record<string, unknown>): string[] {
  const categorias = documento.categorias
  if (!Array.isArray(categorias)) return []

  return categorias
    .map((item) => {
      if (typeof item === 'object' && item !== null) {
        const record = item as Record<string, unknown>
        return String(record.id ?? record._id ?? '').trim()
      }
      return ''
    })
    .filter(Boolean)
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
      const [docRes, metaRes] = await Promise.all([
        getDocumentByIdAction(documentId),
        getMetadataByDocumentIdAction(documentId),
      ])

      if (!docRes.success) {
        toast.error('No se pudo cargar el documento', {
          description: docRes.error,
        })
        return
      }

      const documento = (docRes.data ?? {}) as Record<string, unknown>
      const metadata =
        metaRes.success && metaRes.data ? (metaRes.data as Record<string, unknown>) : null
      const subcarpetaNormaId = String(documento.subcarpetaNormaId || '').trim()
      const carpetaInternaId = String(documento.carpetaInternaId || '').trim() || undefined
      const categoriaIds = readCategoriaIds(documento)

      if (!subcarpetaNormaId) {
        toast.error('Complete la clasificación antes de publicar.', {
          description: 'Edite el borrador y seleccione la clasificación completa del documento.',
        })
        return
      }

      if (categoriaIds.length === 0) {
        toast.error('Asigne al menos una categoría antes de publicar.', {
          description: 'Edite el borrador y seleccione categorías en la taxonomía.',
        })
        return
      }

      const result = await publicarBorradorAction(documentId, {
        subcarpetaNormaId,
        carpetaInternaId,
        categoriaIds,
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
