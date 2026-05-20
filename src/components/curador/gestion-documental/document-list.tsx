import { DocumentCard, DocumentData } from './document-card'

const mockDocuments: DocumentData[] = [
  {
    id: '1',
    title: 'Sentencia Civil 445-2023',
    subtitle: 'Resolución sobre disputa de linderos y servidumbre de paso en predio rústico...',
    status: 'devuelto',
    revisor: 'Dra. Mendoza',
    fecha: '14/10/2023',
    isExpanded: true,
  },
  {
    id: '2',
    title: 'Contrato Arrendamiento C-88',
    subtitle: 'Contrato estándar de arrendamiento comercial para locales en zona franca...',
    status: 'publicado',
    revisor: 'Comité Central',
    fecha: '10/10/2023',
  },
  {
    id: '3',
    title: 'Recurso de Amparo 12/2024',
    subtitle: 'Protección de derechos fundamentales en proceso administrativo tributario...',
    status: 'en-revision',
    revisor: 'Asignando...',
    fecha: '18/10/2023',
  },
  {
    id: '4',
    title: 'Expediente Inmobiliario 102A',
    subtitle: 'Motivo: Documentación ilegible y falta de sellos notariales obligatorios.',
    status: 'rechazado',
    revisor: 'Ilegible',
    fecha: '05/10/2023',
    rechazoMotivo: 'Ilegible',
  },
]

export function DocumentList() {
  return (
    <div className="w-full">
      {mockDocuments.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  )
}
