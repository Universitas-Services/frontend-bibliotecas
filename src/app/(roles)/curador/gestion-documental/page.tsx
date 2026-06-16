import { Suspense } from 'react'

import { DocumentFilters } from '@/components/curador/gestion-documental/document-filters'
import { DocumentList } from '@/components/curador/gestion-documental/document-list'
import type { DocumentFilterId } from '@/lib/document-status'

type PageProps = {
  searchParams: Promise<{
    estado?: string
    busqueda?: string
    tiempo?: string
    page?: string
    limit?: string
  }>
}

const VALID_ESTADOS: DocumentFilterId[] = [
  'todos',
  'publicados',
  'en-revision',
  'borradores',
  'rechazados',
]

export default async function GestionDocumentalPage({ searchParams }: PageProps) {
  const params = await searchParams

  const estadoParam = params.estado
  const estado: DocumentFilterId =
    estadoParam && VALID_ESTADOS.includes(estadoParam as DocumentFilterId)
      ? (estadoParam as DocumentFilterId)
      : 'todos'

  const busqueda = params.busqueda?.trim() || undefined
  const tiempo = params.tiempo || undefined
  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.max(1, Math.min(50, Number(params.limit) || 10))

  return (
    <div className="animate-in fade-in mx-auto w-full max-w-[1400px] p-6 duration-500 md:p-8">
      <Suspense fallback={<div className="mb-6 h-10 animate-pulse rounded-lg bg-[#F3F4F6]" />}>
        <DocumentFilters />
      </Suspense>
      <DocumentList estado={estado} busqueda={busqueda} tiempo={tiempo} page={page} limit={limit} />
    </div>
  )
}
