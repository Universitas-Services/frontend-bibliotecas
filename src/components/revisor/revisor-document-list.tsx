'use client'

import { useState } from 'react'
import { FileText, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RechazarModal } from './rechazar-modal'
import { AprobarModal } from './aprobar-modal'

type RevisorDocumentListProps = {
  documents: Record<string, unknown>[]
}

export function RevisorDocumentList({ documents }: RevisorDocumentListProps) {
  const [rechazarDoc, setRechazarDoc] = useState<{ id: string; title: string } | null>(null)
  const [aprobarDoc, setAprobarDoc] = useState<{ id: string; title: string } | null>(null)

  if (!documents || documents.length === 0) {
    return (
      <div className="mt-6 w-full rounded-xl border border-dashed border-[#C1C7D2] bg-[#F8FAFC] p-12 text-center">
        <h3 className="text-sm font-bold text-[#0F1D30]">Bandeja vacía</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          No hay documentos pendientes de revisión en este momento.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-4 px-6 md:px-8">
      {documents.map((doc) => {
        const id = String(doc.id || doc._id || '')
        const title = String(doc.titulo || doc.tituloIntegro || 'Sin título')
        const tema = String(doc.temaPrincipal || doc.tema || 'Sin tema asignado')
        const tipoNorma = String(doc.tipoNorma || 'Sin norma')

        // Determinar fecha
        let fecha = 'Sin fecha'
        if (doc.ultimaActualizacion && typeof doc.ultimaActualizacion === 'string') {
          fecha = new Date(doc.ultimaActualizacion).toLocaleDateString('es-ES')
        } else if (doc.updatedAt && typeof doc.updatedAt === 'string') {
          fecha = new Date(doc.updatedAt).toLocaleDateString('es-ES')
        } else if (doc.createdAt && typeof doc.createdAt === 'string') {
          fecha = new Date(doc.createdAt).toLocaleDateString('es-ES')
        }

        return (
          <div
            key={id}
            className="overflow-hidden rounded-xl border border-[#C1C7D2] bg-[#FAFAFA] p-5 shadow-sm transition-all"
          >
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex flex-1 items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#D4E4FA]">
                  <FileText className="h-5 w-5 text-[#005496]" />
                </div>
                <div>
                  <h3 className="font-['Inter'] text-[15px] font-bold text-[#0F1D30]">{title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-[13px] text-[#6B7280]">
                    <span className="font-medium">
                      Tema: <span className="text-[#404551]">{tema}</span>
                    </span>
                    <span className="font-medium">
                      Norma: <span className="text-[#404551]">{tipoNorma}</span>
                    </span>
                    <span className="font-medium">
                      Modificado: <span className="text-[#404551]">{fecha}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Button
                  size="sm"
                  className="h-9 bg-[#16A34A] hover:bg-[#15803D]"
                  onClick={() => setAprobarDoc({ id, title })}
                >
                  <Check className="mr-2 h-4 w-4" /> Aprobar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2]"
                  onClick={() => setRechazarDoc({ id, title })}
                >
                  <X className="mr-2 h-4 w-4" /> Rechazar
                </Button>
              </div>
            </div>
          </div>
        )
      })}

      <RechazarModal
        open={!!rechazarDoc}
        onOpenChange={(open) => !open && setRechazarDoc(null)}
        documentId={rechazarDoc?.id || ''}
        documentTitle={rechazarDoc?.title || ''}
      />

      <AprobarModal
        open={!!aprobarDoc}
        onOpenChange={(open) => !open && setAprobarDoc(null)}
        documentId={aprobarDoc?.id || ''}
        documentTitle={aprobarDoc?.title || ''}
      />
    </div>
  )
}
