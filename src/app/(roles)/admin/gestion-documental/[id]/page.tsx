import Link from 'next/link'

import { getDocumentByIdAction } from '@/app/actions/documents'
import { getMetadataByDocumentIdAction } from '@/app/actions/metadatas'
import { getNotasByDocumentoAction } from '@/app/actions/notas-internas'
import { AdminApprovePanel } from '@/components/admin/gestion-documental/admin-approve-panel'
import { AdminNotasPanel } from '@/components/admin/gestion-documental/admin-notas-panel'
import { extractDocumentMatrices } from '@/lib/document-matrices'
import { DocumentMetadataCard } from '@/components/curador/correcciones/document-metadata-card'
import { DocumentPreview } from '@/components/curador/correcciones/document-preview'
import { RevisionHistory } from '@/components/curador/correcciones/revision-history'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mapBackendStatus, DOCUMENT_STATUS_STYLES } from '@/lib/document-status'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminDocumentReviewPage({ params }: PageProps) {
  const { id } = await params

  const [documentRes, metadataRes, notasRes] = await Promise.all([
    getDocumentByIdAction(id),
    getMetadataByDocumentIdAction(id),
    getNotasByDocumentoAction(id),
  ])

  const docData = documentRes.success ? documentRes.data : null
  const metadataData = metadataRes.success ? metadataRes.data : null
  const notas = notasRes.success ? notasRes.data : []

  const combinedData = { ...docData, ...metadataData }
  const titulo =
    combinedData?.titulo ||
    combinedData?.tituloIntegro ||
    combinedData?.nombreBreve ||
    'Documento sin título'
  const estadoBackend = String(combinedData?.estado || 'PENDIENTE_REVISION')
  const status = mapBackendStatus(estadoBackend)
  const statusStyle = DOCUMENT_STATUS_STYLES[status]

  const curatorMatrices = extractDocumentMatrices(
    (docData ?? undefined) as Record<string, unknown> | undefined,
  )

  const curador = combinedData?.curador as Record<string, unknown> | undefined
  const curadorNombre = curador
    ? `${String(curador.nombre || '')} ${String(curador.apellido || '')}`.trim()
    : typeof combinedData?.curadorNombre === 'string'
      ? combinedData.curadorNombre
      : '—'

  if (!documentRes.success) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center">
        <h2 className="text-lg font-bold text-red-800">No se pudo cargar el documento</h2>
        <p className="mt-2 text-sm text-red-600">{documentRes.error}</p>
        <Button asChild className="mt-6">
          <Link href="/admin/gestion-documental">Volver al listado</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in min-h-full bg-[#FAFAFA] pb-12 duration-500">
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#C1C7D2] uppercase">
            <Link href="/admin/gestion-documental" className="hover:text-[#005496]">
              Gestión documental
            </Link>
            <span>{'>'}</span>
            <span className="max-w-[300px] truncate text-[#005496]">{titulo}</span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="mb-2 max-w-[800px] truncate font-['Space_Grotesk'] text-[32px] font-bold tracking-tight text-[#00315C]">
                {titulo}
              </h1>
              <p className="text-[14px] font-medium text-[#6B7280]">
                Curador: {curadorNombre} · ID: {id}
              </p>
            </div>

            <span
              className={`inline-flex self-start rounded-full px-3 py-1 text-[12px] font-bold ${statusStyle.tableStatusColor}`}
            >
              {statusStyle.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] p-6 md:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:sticky lg:top-6 lg:col-span-7 lg:self-start">
            <DocumentPreview documentId={id} />
          </div>

          <div className="lg:col-span-5 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
            <div className="mb-6 space-y-4">
              <AdminApprovePanel
                documentoId={id}
                status={status}
                curatorMatrices={curatorMatrices}
              />
            </div>
            <Tabs defaultValue="notas" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-3 rounded-md bg-[#E5E7EB] p-1">
                <TabsTrigger
                  value="notas"
                  className="rounded-sm py-2 text-[13px] font-bold data-[state=active]:bg-[#00315C] data-[state=active]:text-white"
                >
                  Notas
                </TabsTrigger>
                <TabsTrigger
                  value="metadata"
                  className="rounded-sm py-2 text-[13px] font-bold data-[state=active]:bg-[#00315C] data-[state=active]:text-white"
                >
                  Ficha
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-sm py-2 text-[13px] font-bold data-[state=active]:bg-[#00315C] data-[state=active]:text-white"
                >
                  Historial
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notas" className="mt-0 outline-none">
                <AdminNotasPanel documentoId={id} initialNotas={notas} />
              </TabsContent>

              <TabsContent value="metadata" className="mt-0 outline-none">
                <DocumentMetadataCard document={combinedData} />
              </TabsContent>

              <TabsContent value="history" className="mt-0 outline-none">
                <RevisionHistory notas={notas} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
