import { DocumentCard, type DocumentData } from './document-card'

import { getDocumentsAction } from '@/app/actions/documents'
import { mapBackendStatus } from '@/lib/document-status'

export async function DocumentList() {
  const response = await getDocumentsAction()

  let documents: DocumentData[] = []

  if (response.success && Array.isArray(response.data)) {
    documents = response.data.map((doc: Record<string, unknown>) => {
      const backendStatus = typeof doc.estado === 'string' ? doc.estado : ''

      let fecha = 'Sin fecha'
      if (doc.ultimaActualizacion && typeof doc.ultimaActualizacion === 'string') {
        fecha = new Date(doc.ultimaActualizacion).toLocaleDateString('es-ES')
      }

      return {
        id: String(doc.id || ''),
        title: String(doc.titulo || 'Documento sin título'),
        subtitle: String(doc.resumen || doc.nombreBreve || 'Sin descripción disponible'),
        status: mapBackendStatus(backendStatus),
        revisor: 'No asignado',
        fecha,
      }
    })
  }

  if (documents.length === 0) {
    return (
      <div className="w-full rounded-xl border border-dashed border-[#C1C7D2] bg-[#F8FAFC] p-12 text-center">
        <h3 className="text-sm font-bold text-[#0F1D30]">No hay documentos</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          No se encontraron documentos en la plataforma o hubo un error al cargar.
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
