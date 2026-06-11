import Link from 'next/link'
import { Pencil } from 'lucide-react'

import { getDocumentByIdAction } from '@/app/actions/documents'
import { getMetadataByDocumentIdAction } from '@/app/actions/metadatas'
import { DocumentMetadataCard } from '@/components/curador/correcciones/document-metadata-card'
import { EstadoLegalEditor } from '@/components/shared/estado-legal-editor'
import { DocumentPreview } from '@/components/curador/correcciones/document-preview'
import { CuradorPreviewActions } from '@/components/curador/curador-preview-actions'
import { Button } from '@/components/ui/button'
import { mapBackendStatus } from '@/lib/document-status'
import { getDocumentTimestamp } from '@/lib/session-shared'

export default async function CuradorDocumentPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [documentRes, metadataRes] = await Promise.all([
    getDocumentByIdAction(id),
    getMetadataByDocumentIdAction(id),
  ])

  const docData = documentRes.success ? documentRes.data : null
  const metadataData = metadataRes.success ? metadataRes.data : null
  const combinedData = { ...docData, ...metadataData }

  const titulo = String(combinedData?.titulo || combinedData?.nombreBreve || 'Documento sin título')
  const estado = String(combinedData?.estado || '—')
  const status = mapBackendStatus(estado)
  const canEdit = status === 'borrador' || status === 'en-revision'
  const lastUpdated = getDocumentTimestamp(
    combinedData as Record<string, unknown> | null | undefined,
  )

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#C1C7D2] uppercase">
            <span>Gestión documental</span>
            <span>{'>'}</span>
            <span className="max-w-[300px] truncate text-[#005496]">Previsualización</span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="max-w-[900px] truncate font-['Space_Grotesk'] text-[28px] font-bold tracking-tight text-[#00315C] md:text-[32px]">
                {titulo}
              </h1>
              <p className="mt-1 text-[14px] font-medium text-[#6B7280]">ID: {id}</p>
              <p className="mt-2 text-[12px] font-semibold text-[#6B7280]">
                Última actualización: {lastUpdated}
              </p>
            </div>

            <CuradorPreviewActions className="shrink-0">
              <Button variant="outline" className="h-11 px-6 font-semibold" asChild>
                <Link href="/curador/gestion-documental">Volver al listado</Link>
              </Button>
              {canEdit ? (
                <Button className="h-11 bg-[#005496] px-6 font-semibold hover:bg-[#00315C]" asChild>
                  <Link href={`/curador/nueva-carga?edit=${id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar documento
                  </Link>
                </Button>
              ) : null}
            </CuradorPreviewActions>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 p-6 md:p-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <DocumentPreview documentId={id} />
        </div>
        <div className="space-y-6 lg:col-span-5">
          <EstadoLegalEditor
            documentoId={id}
            currentEstadoLegal={
              typeof combinedData?.estadoLegal === 'string' ? combinedData.estadoLegal : null
            }
          />
          <DocumentMetadataCard document={combinedData} />
        </div>
      </div>
    </div>
  )
}
