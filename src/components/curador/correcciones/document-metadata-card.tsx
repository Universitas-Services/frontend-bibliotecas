import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { extractDocumentMatrices } from '@/lib/document-matrices'

export interface DocumentData {
  titulo?: string | null
  nombreBreve?: string | null
  matrizA?: { id?: string; nombreProducto?: string; nombre?: string } | null
  matrizB?: Array<{ id?: string; tituloArticulo?: string; titulo?: string }> | null
  tipoNorma?: string | null
  temaPrincipal?: string | null
  enteEmisor?: string | null
  resumen?: string | null
  tipoDocumento?: string | null
  numeroGaceta?: string | null
  ambitoTerritorial?: string | null
  pais?: string | null
  fechaPublicacion?: string | null
}

interface DocumentMetadataProps {
  document: DocumentData | null
}

function MetadataBadgeField({
  label,
  value,
  badgeClassName,
}: {
  label: string
  value: string
  badgeClassName: string
}) {
  return (
    <div className="min-w-0 rounded-md bg-white p-5 shadow-sm">
      <h4 className="mb-2 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
        {label}
      </h4>
      <Badge
        className={`inline-flex h-auto max-w-full px-2.5 py-1 text-[10px] leading-snug font-bold whitespace-normal uppercase ${badgeClassName}`}
      >
        {value}
      </Badge>
    </div>
  )
}

export function DocumentMetadataCard({ document }: DocumentMetadataProps) {
  if (!document) {
    return (
      <Card className="overflow-hidden border-[#E5E7EB] bg-[#F9FAFB] p-6 text-center text-gray-500 shadow-sm">
        No hay datos del documento disponibles.
      </Card>
    )
  }

  const matrices = extractDocumentMatrices(document as Record<string, unknown>)

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-[#E5E7EB] bg-[#F9FAFB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB] bg-white pb-4">
          <CardTitle className="text-[18px] font-bold text-[#00315C]">
            Ficha del documento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="m-4 rounded-md border-b border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Título Íntegro
            </h4>
            <p className="text-[15px] leading-snug font-semibold text-[#005496]">
              {document.titulo || 'Sin título'}
            </p>
          </div>
          <div className="mx-4 mb-4 rounded-md border-b border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Título breve
            </h4>
            <p className="text-[15px] font-semibold text-[#00315C]">
              {document.nombreBreve || 'No definido'}
            </p>
          </div>

          <div className="mx-4 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MetadataBadgeField
              label="Tipo de documento"
              value={document.tipoDocumento || 'No clasificado'}
              badgeClassName="bg-[#10130B] text-white"
            />
            <MetadataBadgeField
              label="Tipo de norma"
              value={document.tipoNorma?.replace(/-/g, ' ') || 'No clasificado'}
              badgeClassName="bg-[#10130B] text-white"
            />
          </div>

          <div className="mx-4 mb-4 flex flex-col gap-4 md:flex-row">
            <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Rama del derecho
              </h4>
              <p className="text-[14px] font-bold text-[#00315C]">
                {document.temaPrincipal || 'No especificado'}
              </p>
            </div>
            <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Ámbito territorial
              </h4>
              <p className="text-[14px] font-bold text-[#00315C]">
                {document.ambitoTerritorial || 'No especificado'}{' '}
                {document.pais ? `(${document.pais})` : ''}
              </p>
            </div>
          </div>

          <div className="mx-4 mb-4 rounded-md bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Ente emisor
            </h4>
            <p className="text-[14px] font-bold text-[#005496]">
              {document.enteEmisor || 'No especificado'}
            </p>
          </div>

          <div className="mx-4 mb-4 rounded-md bg-white p-5 shadow-sm">
            <h4 className="mb-2 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Matrices de vinculación
            </h4>
            <div className="space-y-2 text-sm text-[#00315C]">
              <p>
                <span className="font-semibold">Matriz A:</span>{' '}
                {matrices.matrizA?.nombre || 'Sin asignar'}
              </p>
              <div>
                <span className="font-semibold">Matriz B:</span>
                {matrices.matrizB.length > 0 ? (
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {matrices.matrizB.map((item) => (
                      <li key={item.id}>{item.titulo}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-1">Sin asignar</span>
                )}
              </div>
            </div>
          </div>

          <div className="mx-4 mb-5 flex flex-col gap-4 md:flex-row">
            <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Número de Gaceta
              </h4>
              <p className="text-[14px] font-bold text-[#005496]">
                {document.numeroGaceta || 'No especificado'}
              </p>
            </div>
            <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Fecha Publicación
              </h4>
              <p className="text-[14px] font-bold text-[#005496] capitalize">
                {document.fechaPublicacion
                  ? new Date(document.fechaPublicacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'No especificado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5E7EB] bg-[#F9FAFB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB] bg-white pb-3">
          <CardTitle className="text-[11px] font-bold tracking-wider text-[#6B7280] uppercase">
            RESUMEN DESCRIPTIVO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="rounded-md bg-white p-6 text-[14px] leading-relaxed font-medium text-[#404551] shadow-sm">
            {document.resumen || 'Este documento no tiene un resumen cargado en la base de datos.'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
