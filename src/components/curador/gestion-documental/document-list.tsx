import Link from 'next/link'

import { DocumentCard, type DocumentData } from './document-card'
import { DocumentPagination } from './document-pagination'

import { getCuradorDocumentsAction } from '@/app/actions/curador-documents'
import { getDocumentosConNotasAction } from '@/app/actions/notas-internas'
import { Button } from '@/components/ui/button'
import { mapDocumentStatus, type DocumentFilterId } from '@/lib/document-status'

type DocumentListProps = {
  estado?: DocumentFilterId
  busqueda?: string
  tiempo?: string
  page?: number
  limit?: number
}

type NotasPorDocumento = Record<string, { ultimaNota?: string }>

function mapDocument(
  doc: Record<string, unknown>,
  notasPorDocumento: NotasPorDocumento,
): DocumentData {
  let fecha = 'Sin fecha'
  if (doc.ultimaActualizacion && typeof doc.ultimaActualizacion === 'string') {
    fecha = new Date(doc.ultimaActualizacion).toLocaleDateString('es-ES')
  } else if (doc.updatedAt && typeof doc.updatedAt === 'string') {
    fecha = new Date(doc.updatedAt).toLocaleDateString('es-ES')
  } else if (doc.createdAt && typeof doc.createdAt === 'string') {
    fecha = new Date(doc.createdAt).toLocaleDateString('es-ES')
  }

  const revisor =
    typeof doc.revisor === 'string'
      ? doc.revisor
      : doc.revisor && typeof doc.revisor === 'object'
        ? String((doc.revisor as Record<string, unknown>).nombre || 'No asignado')
        : 'No asignado'

  const id = String(doc.id || doc._id || '')
  const notasInfo = notasPorDocumento[id]

  return {
    id,
    title: String(doc.titulo || doc.tituloIntegro || 'Documento sin título'),
    subtitle: String(doc.resumen || doc.nombreBreve || 'Sin descripción disponible'),
    status: mapDocumentStatus(doc),
    revisor,
    fecha,
    tieneNotas: Boolean(notasInfo),
    ultimaNota: notasInfo?.ultimaNota,
  }
}

function isAuthError(status?: number, code?: string): boolean {
  return status === 401 || code === 'TOKEN_EXPIRED' || code === 'NO_TOKEN'
}

export async function DocumentList({
  estado = 'todos',
  busqueda,
  tiempo,
  page = 1,
  limit = 10,
}: DocumentListProps) {
  const [response, notasResponse] = await Promise.all([
    getCuradorDocumentsAction({
      estado: estado === 'todos' ? undefined : estado,
      busqueda,
      tiempo,
      page,
      limit,
    }),
    getDocumentosConNotasAction(),
  ])

  const notasPorDocumento: NotasPorDocumento = {}
  if (notasResponse.success) {
    for (const doc of notasResponse.data) {
      if (doc.id) {
        notasPorDocumento[doc.id] = { ultimaNota: doc.ultimaNota }
      }
    }
  }

  if (!response.success) {
    const showReLogin = isAuthError(response.status, response.code)

    return (
      <div className="w-full rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-12 text-center">
        <h3 className="text-sm font-bold text-[#93000A]">Error al cargar documentos</h3>
        <p className="mt-2 text-sm whitespace-pre-line text-[#6B7280]">
          {response.error}
          {response.details ? `\n${response.details}` : ''}
        </p>
        {showReLogin && (
          <Button asChild className="mt-6 bg-[#005496] hover:bg-[#00315C]">
            <Link href="/login?logout=1">Iniciar sesión nuevamente</Link>
          </Button>
        )}
      </div>
    )
  }

  const { documents, total, page: currentPage, limit: pageLimit, totalPages } = response.data
  const mappedDocuments = documents.map((doc) => mapDocument(doc, notasPorDocumento))

  if (mappedDocuments.length === 0) {
    return (
      <div className="w-full rounded-xl border border-dashed border-[#C1C7D2] bg-[#F8FAFC] p-12 text-center">
        <h3 className="text-sm font-bold text-[#0F1D30]">No hay documentos</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          No se encontraron documentos con los filtros seleccionados.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        {mappedDocuments.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
      <DocumentPagination
        page={currentPage}
        limit={pageLimit}
        total={total}
        totalPages={totalPages}
      />
    </>
  )
}
