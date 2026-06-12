import { mapBackendStatus, type DocumentStatus } from '@/lib/document-status'

export type DashboardDocument = {
  id: string
  title: string
  subtitle: string
  status: DocumentStatus
  fecha: string
  timestamp: number
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function getTimestamp(doc: Record<string, unknown>): number {
  const raw =
    readString(doc.ultimaActualizacion) || readString(doc.updatedAt) || readString(doc.createdAt)

  if (!raw) return 0
  const time = new Date(raw).getTime()
  return Number.isNaN(time) ? 0 : time
}

export function mapToDashboardDocument(doc: Record<string, unknown>): DashboardDocument {
  const timestamp = getTimestamp(doc)
  const fecha = timestamp ? new Date(timestamp).toLocaleDateString('es-ES') : 'Sin fecha'

  return {
    id: String(doc.id || doc._id || ''),
    title: String(doc.titulo || doc.tituloIntegro || 'Documento sin título'),
    subtitle: String(doc.resumen || doc.nombreBreve || 'Sin descripción'),
    status: mapBackendStatus(readString(doc.estado)),
    fecha,
    timestamp,
  }
}

export type DashboardStats = {
  total: number
  publicados: number
  enRevision: number
  borradores: number
}

export function computeDashboardStats(documents: DashboardDocument[]): DashboardStats {
  return {
    total: documents.length,
    publicados: documents.filter((doc) => doc.status === 'publicado').length,
    enRevision: documents.filter((doc) => doc.status === 'en-revision').length,
    borradores: documents.filter((doc) => doc.status === 'borrador').length,
  }
}

export type WeeklyActivityPoint = {
  day: string
  count: number
}

export function computeWeeklyActivity(documents: DashboardDocument[]): WeeklyActivityPoint[] {
  const labels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const counts = new Array(7).fill(0)
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(now.getDate() - 6)

  for (const doc of documents) {
    if (!doc.timestamp) continue
    const date = new Date(doc.timestamp)
    if (date < weekAgo || date > now) continue
    counts[date.getDay()] += 1
  }

  return labels.map((day, index) => ({
    day,
    count: counts[index] ?? 0,
  }))
}
