import { SALAS_TSJ } from '@/lib/catalogs/venezuela-territorial'

export type MetadataFieldType = 'text' | 'date' | 'number' | 'select' | 'textarea'

export type TerritorialOptionSource =
  | 'global-estado'
  | 'global-municipio'
  | 'global-parroquia'
  | 'global-tribunal'

export type MetadataFieldDefinition = {
  key: string
  label: string
  type: MetadataFieldType
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  dependsOn?: string
  dependsOnId?: string
  companionIdKey?: string
  optionSource?: TerritorialOptionSource
  getOptions?: (values: Record<string, string>) => { value: string; label: string }[]
}

export type MetadataSchema = {
  key: string
  label: string
  fields: MetadataFieldDefinition[]
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const LEGISLACION_NACIONAL_RANGOS = [
  'Constitución',
  'Ley Orgánica',
  'Ley Ordinaria',
  'Ley Especial',
  'Decreto Ley',
  'Decreto-Ley',
  'Reglamento',
  'Decreto',
  'Resolución',
  'Providencia',
].map((r) => ({ value: r, label: r }))

const LEGISLACION_ESTADAL_RANGOS = [
  'Constitución Estadal',
  'Ley Estadal',
  'Decreto Estadal',
  'Resolución Estadal',
].map((r) => ({ value: r, label: r }))

const LEGISLACION_MUNICIPAL_RANGOS = [
  'Ordenanza',
  'Decreto Municipal',
  'Resolución Municipal',
  'Acuerdo Municipal',
].map((r) => ({ value: r, label: r }))

export const TERRITORIAL_ID_KEYS = ['estadoId', 'municipioId', 'parroquiaId', 'tribunalId'] as const

/** Campos que se limpian al cambiar un select territorial padre. */
export const TERRITORIAL_CASCADE_CLEAR: Record<string, string[]> = {
  estado: ['municipio', 'municipioId', 'parroquia', 'parroquiaId', 'tribunal', 'tribunalId'],
  municipio: ['parroquia', 'parroquiaId', 'tribunal', 'tribunalId'],
  parroquia: [],
  tribunal: [],
}

export const METADATA_SCHEMAS: Record<string, MetadataSchema> = {
  'legislacion-nacional': {
    key: 'legislacion-nacional',
    label: 'Legislación Nacional',
    fields: [
      {
        key: 'rango',
        label: 'Rango normativo',
        type: 'select',
        required: true,
        options: LEGISLACION_NACIONAL_RANGOS,
      },
      {
        key: 'numeroGaceta',
        label: 'N° de Gaceta Oficial',
        type: 'text',
        required: true,
        placeholder: 'Ej: 42.123',
      },
      { key: 'fechaPromulgacion', label: 'Fecha de promulgación', type: 'date', required: true },
      {
        key: 'ambitoGeografico',
        label: 'Ámbito geográfico',
        type: 'text',
        required: true,
        placeholder: 'Nacional',
      },
    ],
  },
  'legislacion-estadal': {
    key: 'legislacion-estadal',
    label: 'Legislación Estadal',
    fields: [
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: true,
        optionSource: 'global-estado',
        companionIdKey: 'estadoId',
      },
      {
        key: 'rango',
        label: 'Rango normativo',
        type: 'select',
        required: true,
        options: LEGISLACION_ESTADAL_RANGOS,
      },
      { key: 'numeroGacetaEstadal', label: 'N° Gaceta Estadal', type: 'text', required: true },
      { key: 'fechaPromulgacion', label: 'Fecha de promulgación', type: 'date', required: true },
    ],
  },
  'legislacion-municipal': {
    key: 'legislacion-municipal',
    label: 'Legislación Municipal',
    fields: [
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: true,
        optionSource: 'global-estado',
        companionIdKey: 'estadoId',
      },
      {
        key: 'municipio',
        label: 'Municipio',
        type: 'select',
        required: true,
        dependsOn: 'estado',
        dependsOnId: 'estadoId',
        optionSource: 'global-municipio',
        companionIdKey: 'municipioId',
      },
      {
        key: 'parroquia',
        label: 'Parroquia',
        type: 'select',
        required: true,
        dependsOn: 'municipio',
        dependsOnId: 'municipioId',
        optionSource: 'global-parroquia',
        companionIdKey: 'parroquiaId',
      },
      {
        key: 'rango',
        label: 'Rango normativo',
        type: 'select',
        required: true,
        options: LEGISLACION_MUNICIPAL_RANGOS,
      },
      { key: 'numeroGacetaMunicipal', label: 'N° Gaceta Municipal', type: 'text', required: true },
      { key: 'fechaPromulgacion', label: 'Fecha de promulgación', type: 'date', required: true },
    ],
  },
  'jurisprudencia-tsj': {
    key: 'jurisprudencia-tsj',
    label: 'Jurisprudencia — TSJ',
    fields: [
      {
        key: 'sala',
        label: 'Sala',
        type: 'select',
        required: true,
        options: SALAS_TSJ.map((s) => ({ value: s, label: s })),
      },
      { key: 'numeroSentencia', label: 'N° de sentencia', type: 'text', required: true },
      { key: 'numeroExpediente', label: 'N° de expediente', type: 'text', required: true },
      { key: 'fechaSentencia', label: 'Fecha de sentencia', type: 'date', required: true },
      { key: 'magistradoPonente', label: 'Magistrado ponente', type: 'text', required: true },
      { key: 'partes', label: 'Partes', type: 'text', required: false },
      { key: 'materia', label: 'Materia', type: 'text', required: false },
      {
        key: 'decision',
        label: 'Decisión',
        type: 'select',
        required: true,
        options: [
          { value: 'Con lugar', label: 'Con lugar' },
          { value: 'Sin lugar', label: 'Sin lugar' },
          { value: 'Inhibitoria', label: 'Inhibitoria' },
        ],
      },
    ],
  },
  'jurisprudencia-contencioso': {
    key: 'jurisprudencia-contencioso',
    label: 'Jurisprudencia — Contencioso Administrativo',
    fields: [
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: false,
        optionSource: 'global-estado',
        companionIdKey: 'estadoId',
      },
      {
        key: 'municipio',
        label: 'Municipio',
        type: 'select',
        required: false,
        dependsOn: 'estado',
        dependsOnId: 'estadoId',
        optionSource: 'global-municipio',
        companionIdKey: 'municipioId',
      },
      {
        key: 'tribunal',
        label: 'Tribunal',
        type: 'select',
        required: true,
        optionSource: 'global-tribunal',
        companionIdKey: 'tribunalId',
      },
      { key: 'numeroSentencia', label: 'N° de sentencia', type: 'text', required: true },
      { key: 'numeroExpediente', label: 'N° de expediente', type: 'text', required: true },
      { key: 'fechaSentencia', label: 'Fecha de sentencia', type: 'date', required: true },
      { key: 'juezPonente', label: 'Juez ponente', type: 'text', required: true },
      { key: 'partes', label: 'Partes', type: 'text', required: false },
      {
        key: 'decision',
        label: 'Decisión',
        type: 'select',
        required: true,
        options: [
          { value: 'Con lugar', label: 'Con lugar' },
          { value: 'Sin lugar', label: 'Sin lugar' },
        ],
      },
    ],
  },
  'jurisprudencia-internacional': {
    key: 'jurisprudencia-internacional',
    label: 'Jurisprudencia Internacional',
    fields: [
      {
        key: 'organismoInternacional',
        label: 'Organismo internacional',
        type: 'text',
        required: true,
      },
      {
        key: 'tribunalInternacional',
        label: 'Tribunal internacional',
        type: 'text',
        required: true,
      },
      { key: 'sala', label: 'Sala (si aplica)', type: 'text', required: false },
      { key: 'numeroSentencia', label: 'N° de sentencia o decisión', type: 'text', required: true },
      { key: 'numeroExpediente', label: 'N° de expediente', type: 'text', required: false },
      { key: 'fechaSentencia', label: 'Fecha de la decisión', type: 'date', required: true },
    ],
  },
  'doctrina-libros': {
    key: 'doctrina-libros',
    label: 'Doctrina — Libros y Ensayos',
    fields: [
      { key: 'autor', label: 'Autor(es)', type: 'text', required: true },
      { key: 'editorial', label: 'Editorial', type: 'text', required: true },
      { key: 'edicion', label: 'Edición', type: 'text', required: false },
      { key: 'anioPublicacion', label: 'Año de publicación', type: 'number', required: true },
      { key: 'isbn', label: 'ISBN', type: 'text', required: false },
      { key: 'numeroPaginas', label: 'N° de páginas', type: 'number', required: false },
      { key: 'numeroTomos', label: 'N° de tomos', type: 'number', required: false },
      { key: 'tomo', label: 'Tomo', type: 'text', required: false },
    ],
  },
  'doctrina-revistas': {
    key: 'doctrina-revistas',
    label: 'Doctrina — Revistas y Artículos',
    fields: [
      { key: 'autor', label: 'Autor(es)', type: 'text', required: true },
      { key: 'nombreRevista', label: 'Nombre de la revista', type: 'text', required: true },
      { key: 'volumen', label: 'Volumen', type: 'text', required: false },
      { key: 'numero', label: 'Número', type: 'text', required: false },
      { key: 'anioPublicacion', label: 'Año', type: 'number', required: true },
      { key: 'paginas', label: 'Páginas', type: 'text', required: false, placeholder: 'Ej: 15-42' },
      { key: 'issn', label: 'ISSN', type: 'text', required: false },
    ],
  },
  'doctrina-articulos-opinion': {
    key: 'doctrina-articulos-opinion',
    label: 'Doctrina — Artículos de Opinión',
    fields: [
      { key: 'autor', label: 'Autor(es)', type: 'text', required: true },
      { key: 'nombreMedio', label: 'Nombre del medio', type: 'text', required: true },
      { key: 'tipoMedio', label: 'Tipo de medio', type: 'text', required: false },
      { key: 'urlArticulo', label: 'URL del artículo', type: 'text', required: false },
      { key: 'fechaPublicacion', label: 'Fecha de publicación', type: 'date', required: true },
    ],
  },
  'doctrina-ponencias': {
    key: 'doctrina-ponencias',
    label: 'Doctrina — Ponencias',
    fields: [
      { key: 'ponente', label: 'Ponente', type: 'text', required: true },
      { key: 'nombreEvento', label: 'Nombre del evento', type: 'text', required: true },
      { key: 'organizador', label: 'Organizador', type: 'text', required: false },
      { key: 'ciudad', label: 'Ciudad', type: 'text', required: false },
      { key: 'paisEvento', label: 'País', type: 'text', required: false },
      { key: 'fechaPresentacion', label: 'Fecha de presentación', type: 'date', required: true },
    ],
  },
  'doctrina-informes': {
    key: 'doctrina-informes',
    label: 'Doctrina — Informes Técnicos',
    fields: [
      { key: 'autor', label: 'Autor', type: 'text', required: true },
      {
        key: 'institucionResponsable',
        label: 'Institución responsable',
        type: 'text',
        required: true,
      },
      { key: 'numeroInforme', label: 'N° de informe', type: 'text', required: false },
      { key: 'anioPublicacion', label: 'Año', type: 'number', required: true },
    ],
  },
  'modelos-formatos': {
    key: 'modelos-formatos',
    label: 'Modelos y Formatos',
    fields: [
      { key: 'tipoModelo', label: 'Tipo de modelo', type: 'text', required: true },
      { key: 'materia', label: 'Materia', type: 'text', required: true },
      { key: 'autorModelo', label: 'Autor del modelo', type: 'text', required: false },
      { key: 'ultimaActualizacion', label: 'Última actualización', type: 'date', required: false },
      {
        key: 'formatoArchivo',
        label: 'Formato de archivo',
        type: 'text',
        required: false,
        placeholder: 'pdf, docx...',
      },
    ],
  },
  'doctrina-administrativa': {
    key: 'doctrina-administrativa',
    label: 'Doctrina Administrativa',
    fields: [
      { key: 'numeroDocumento', label: 'N° del documento', type: 'text', required: true },
      { key: 'fechaPublicacion', label: 'Fecha del documento', type: 'date', required: true },
      {
        key: 'codigoReferenciaInterna',
        label: 'Código o referencia interna',
        type: 'text',
        required: false,
      },
      {
        key: 'dependenciaAdministrativa',
        label: 'Dependencia administrativa',
        type: 'text',
        required: true,
      },
      { key: 'funcionarioFirmante', label: 'Funcionario firmante', type: 'text', required: false },
      { key: 'cargoFuncionario', label: 'Cargo del funcionario', type: 'text', required: false },
      { key: 'remitente', label: 'Remitente', type: 'text', required: false },
      { key: 'destinatarios', label: 'Destinatario(s)', type: 'text', required: false },
      { key: 'consultante', label: 'Consultante', type: 'text', required: false },
    ],
  },
  'instrumentos-internacionales': {
    key: 'instrumentos-internacionales',
    label: 'Instrumentos Internacionales',
    fields: [
      {
        key: 'organizacionInternacional',
        label: 'Organización internacional',
        type: 'text',
        required: true,
      },
      {
        key: 'organismoDepositario',
        label: 'Organismo depositario',
        type: 'text',
        required: false,
      },
      { key: 'numeroInstrumento', label: 'N° del instrumento', type: 'text', required: false },
      {
        key: 'siglasAcronimo',
        label: 'Siglas o acrónimo',
        type: 'text',
        required: false,
        placeholder: 'CADH, PIDCP...',
      },
      { key: 'lugarAdopcion', label: 'Lugar de adopción', type: 'text', required: false },
      { key: 'fechaAdopcion', label: 'Fecha de adopción', type: 'date', required: false },
      { key: 'fechaFirma', label: 'Fecha de firma', type: 'date', required: false },
      { key: 'fechaRatificacion', label: 'Fecha de ratificación', type: 'date', required: false },
      {
        key: 'fechaEntradaVigor',
        label: 'Fecha de entrada en vigor',
        type: 'date',
        required: false,
      },
      { key: 'estadosParte', label: 'Estados Parte', type: 'text', required: false },
      { key: 'idiomasOficiales', label: 'Idioma(s) oficial(es)', type: 'text', required: false },
      {
        key: 'instrumentoPrincipal',
        label: 'Instrumento principal (protocolos)',
        type: 'text',
        required: false,
      },
      { key: 'organismoEmisor', label: 'Organismo emisor', type: 'text', required: false },
      { key: 'numeroDecision', label: 'N° de decisión', type: 'text', required: false },
    ],
  },
}

export function resolveMetadataSchemaKey(
  tipoDocumentoNombre: string,
  carpetaPathNames: string[],
): string | null {
  const tipo = normalize(tipoDocumentoNombre)
  const path = carpetaPathNames.map(normalize)
  const has = (fragment: string) => path.some((p) => p.includes(fragment))

  if (tipo.includes('legislacion')) {
    if (has('municipal')) return 'legislacion-municipal'
    if (has('estadal')) return 'legislacion-estadal'
    return 'legislacion-nacional'
  }

  if (tipo.includes('jurisprudencia')) {
    if (has('internacional')) return 'jurisprudencia-internacional'
    if (has('supremo') || has('tsj')) return 'jurisprudencia-tsj'
    return 'jurisprudencia-contencioso'
  }

  if (tipo.includes('doctrina administrativa')) return 'doctrina-administrativa'
  if (tipo.includes('instrumentos internacionales')) return 'instrumentos-internacionales'
  if (tipo.includes('modelo') || tipo.includes('formato') || tipo.includes('practica legal')) {
    return 'modelos-formatos'
  }

  if (tipo.includes('doctrina')) {
    if (has('ponencia') || has('conferencia')) return 'doctrina-ponencias'
    if (has('informe')) return 'doctrina-informes'
    if (has('opinion')) return 'doctrina-articulos-opinion'
    if (has('revista') || has('articulo') || has('cientifico')) return 'doctrina-revistas'
    return 'doctrina-libros'
  }

  return null
}

export function buildMetadatosFromForm(
  schemaKey: string | null,
  formValues: Record<string, string>,
): Record<string, unknown> {
  if (!schemaKey) return {}

  const schema = METADATA_SCHEMAS[schemaKey]
  if (!schema) return {}

  const result: Record<string, unknown> = {}

  for (const field of schema.fields) {
    const raw = formValues[field.key]?.trim() ?? ''
    if (!raw) continue

    if (field.type === 'number') {
      const num = Number(raw)
      if (!Number.isNaN(num)) result[field.key] = num
    } else {
      result[field.key] = raw
    }
  }

  for (const idKey of TERRITORIAL_ID_KEYS) {
    const raw = formValues[idKey]?.trim() ?? ''
    if (!raw) continue
    const num = Number(raw)
    if (!Number.isNaN(num)) result[idKey] = num
  }

  if (schemaKey === 'legislacion-nacional' && !result.ambitoGeografico) {
    result.ambitoGeografico = 'Nacional'
  }

  return result
}

export function validateMetadatosForm(
  schemaKey: string | null,
  formValues: Record<string, string>,
): { field: string; message: string }[] {
  if (!schemaKey) {
    return [
      {
        field: 'metadatos',
        message: 'No hay esquema de metadatos para este tipo documental.',
      },
    ]
  }

  const schema = METADATA_SCHEMAS[schemaKey]
  if (!schema) return []

  const issues: { field: string; message: string }[] = []

  for (const field of schema.fields) {
    if (!field.required) continue
    const value = formValues[field.key]?.trim() ?? ''
    if (!value) {
      issues.push({ field: field.key, message: `${field.label} es obligatorio.` })
    }
  }

  return issues
}

export function parseMetadatosObject(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const record = value as Record<string, unknown>
  const result: Record<string, string> = {}
  for (const [key, val] of Object.entries(record)) {
    if (val === null || val === undefined) continue
    result[key] = String(val)
  }
  return result
}
