import Link from 'next/link'

import { DocumentCard, type DocumentData } from './document-card'

import { getDocumentsAction } from '@/app/actions/documents'
import { Button } from '@/components/ui/button'
import { mapBackendStatus } from '@/lib/document-status'

function mapDocument(doc: Record<string, unknown>): DocumentData {
  const backendStatus = typeof doc.estado === 'string' ? doc.estado : ''

  let fecha = 'Sin fecha'
  if (doc.ultimaActualizacion && typeof doc.ultimaActualizacion === 'string') {
    fecha = new Date(doc.ultimaActualizacion).toLocaleDateString('es-ES')
  }

  return {
    id: String(doc.id || doc._id || ''),
    title: String(doc.titulo || doc.tituloIntegro || 'Documento sin título'),
    subtitle: String(doc.resumen || doc.nombreBreve || 'Sin descripción disponible'),
    status: mapBackendStatus(backendStatus),
    revisor: 'No asignado',
    fecha,
  }
}

function isAuthError(status?: number, code?: string): boolean {
  return status === 401 || code === 'TOKEN_EXPIRED' || code === 'NO_TOKEN'
}

export async function DocumentList() {
  const response = await getDocumentsAction()

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

  const documents = response.data.map(mapDocument)

  if (documents.length === 0) {
    return (
      <div className="w-full rounded-xl border border-dashed border-[#C1C7D2] bg-[#F8FAFC] p-12 text-center">
        <h3 className="text-sm font-bold text-[#0F1D30]">No hay documentos</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          No se encontraron documentos en la plataforma.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  )
}
