import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { extractDocumentCategorias } from '@/lib/document-categorias'
import { extractDocumentEtiquetas, extractDocumentKeywords } from '@/lib/document-etiquetas'
import { extractDocumentMatrices } from '@/lib/document-matrices'
import {
  parseMetadatosObject,
  TERRITORIAL_ID_KEYS,
  shouldDisplayPaisForDocument,
} from '@/lib/metadata-schemas'

export interface DocumentData {
  titulo?: string | null
  nombreBreve?: string | null
  matrizA?: { id?: string; nombreProducto?: string; nombre?: string } | null
  matrizB?: Array<{ id?: string; tituloArticulo?: string; titulo?: string }> | null
  tipoNorma?: string | null
  temaPrincipal?: string | null
  resumen?: string | null
  etiquetas?: unknown
  keywords?: unknown
  tipoDocumento?: string | null
  pais?: string | null
  metadatos?: Record<string, unknown> | null
  gacetaPdfUrl?: string | null
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

function MetadataField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
        {label}
      </h4>
      <p className="text-[14px] font-bold text-[#005496]">{value}</p>
    </div>
  )
}

const METADATA_LABELS: Record<string, string> = {
  rango: 'Rango normativo',
  numeroGaceta: 'N° Gaceta',
  numeroGacetaEstadal: 'N° Gaceta Estadal',
  numeroGacetaMunicipal: 'N° Gaceta Municipal',
  fechaPromulgacion: 'Fecha promulgación',
  estado: 'Estado',
  municipio: 'Municipio',
  parroquia: 'Parroquia',
  sala: 'Sala',
  tribunal: 'Tribunal',
  numeroSentencia: 'N° Sentencia',
  numeroExpediente: 'N° Expediente',
  magistradoPonente: 'Magistrado ponente',
  juezPonente: 'Juez ponente',
  decision: 'Decisión',
  autor: 'Autor',
  editorial: 'Editorial',
  isbn: 'ISBN',
  nombreRevista: 'Revista',
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
  const categorias = extractDocumentCategorias(document as Record<string, unknown>)
  const etiquetas = extractDocumentEtiquetas(document as Record<string, unknown>)
  const keywords = extractDocumentKeywords(document as Record<string, unknown>)
  const metadatos = parseMetadatosObject(document.metadatos)
  const hiddenMetadataKeys = new Set<string>(TERRITORIAL_ID_KEYS)
  const visibleMetadatos = Object.entries(metadatos).filter(([key]) => !hiddenMetadataKeys.has(key))
  const showPais = shouldDisplayPaisForDocument(document.tipoDocumento || document.tipoNorma, [])

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

          <div className={`mx-4 mb-4 flex flex-col gap-4 ${showPais ? 'md:flex-row' : ''}`}>
            <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Rama del derecho
              </h4>
              <p className="text-[14px] font-bold text-[#00315C]">
                {document.temaPrincipal || 'No especificado'}
              </p>
            </div>
            {showPais ? (
              <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
                <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                  País
                </h4>
                <p className="text-[14px] font-bold text-[#00315C]">
                  {document.pais || 'No especificado'}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mx-4 mb-4 rounded-md bg-white p-5 shadow-sm">
            <h4 className="mb-2 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Categorías asignadas
            </h4>
            {categorias.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categorias.map((categoria) => (
                  <Badge
                    key={categoria.id}
                    className="rounded-full bg-[#00315C] px-3 py-1 text-[11px] font-semibold text-white"
                  >
                    {categoria.nombre}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-[14px] font-medium text-[#6B7280]">Sin categorías asignadas</p>
            )}
          </div>

          <div className="mx-4 mb-4 rounded-md bg-white p-5 shadow-sm">
            <h4 className="mb-2 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Etiquetas
            </h4>
            {etiquetas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {etiquetas.map((etiqueta) => (
                  <Badge
                    key={etiqueta}
                    variant="outline"
                    className="rounded-full border-[#93C5FD] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold text-[#1D4ED8]"
                  >
                    #{etiqueta}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-[14px] font-medium text-[#6B7280]">Sin etiquetas asignadas</p>
            )}
          </div>

          {document.gacetaPdfUrl ? (
            <div className="mx-4 mb-4 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Gaceta Oficial
              </h4>
              <a
                href={document.gacetaPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-bold text-[#005496] underline"
              >
                Descargar PDF de Gaceta
              </a>
            </div>
          ) : null}

          {visibleMetadatos.length > 0 ? (
            <div className="mx-4 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visibleMetadatos.map(([key, value]) => (
                <MetadataField key={key} label={METADATA_LABELS[key] || key} value={value || '—'} />
              ))}
            </div>
          ) : null}

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

      {keywords.length > 0 ? (
        <Card className="border-[#E5E7EB] bg-[#F9FAFB] shadow-sm">
          <CardHeader className="border-b border-[#E5E7EB] bg-white pb-3">
            <CardTitle className="text-[11px] font-bold tracking-wider text-[#6B7280] uppercase">
              Palabras clave
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="rounded-full bg-[#E2E8F0] px-3 py-1 text-[11px] font-semibold text-[#334155]"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
