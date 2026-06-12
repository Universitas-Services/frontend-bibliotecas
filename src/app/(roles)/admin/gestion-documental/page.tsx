import { Suspense } from 'react'

import { getAdminDocumentsAction } from '@/app/actions/admin-documents'
import { listUsersAction } from '@/app/actions/users'
import { AdminDocumentsTable } from '@/components/admin/gestion-documental/admin-documents-table'

type PageProps = {
  searchParams: Promise<{
    curadorId?: string
    conNotas?: string
    page?: string
    limit?: string
  }>
}

export default async function AdminGestionDocumentalPage({ searchParams }: PageProps) {
  const params = await searchParams
  const curadorId = params.curadorId || undefined
  const conNotas = params.conNotas === 'true'
  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.max(1, Math.min(50, Number(params.limit) || 10))

  const [documentsRes, curadoresRes] = await Promise.all([
    getAdminDocumentsAction({ curadorId, conNotas, page, limit }),
    listUsersAction({ role: 'CURADOR', limit: 100 }),
  ])

  if (!documentsRes.success) {
    return (
      <div className="mx-auto max-w-6xl p-6 pt-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="font-semibold text-red-800">Error al cargar documentos</h2>
          <p className="mt-2 text-sm text-red-600">{documentsRes.error}</p>
        </div>
      </div>
    )
  }

  const curadores =
    curadoresRes.success && Array.isArray(curadoresRes.data?.items)
      ? curadoresRes.data.items.map((user: Record<string, unknown>) => ({
          id: String(user.id || user._id || ''),
          nombre: `${String(user.nombre || '')} ${String(user.apellido || '')}`.trim(),
          email: typeof user.email === 'string' ? user.email : undefined,
        }))
      : []

  const { documents, total, page: currentPage, totalPages } = documentsRes.data

  return (
    <div className="mx-auto max-w-6xl p-6 pt-10 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1e3a5f]">Gestión documental</h1>
        <p className="mt-2 text-lg text-slate-500">
          Revise los documentos subidos por curadores, previsualícelos y deje notas de ajuste.
        </p>
      </div>

      <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-slate-100" />}>
        <AdminDocumentsTable
          documents={documents}
          curadores={curadores}
          selectedCuradorId={curadorId}
          conNotas={conNotas}
          page={currentPage}
          totalPages={totalPages}
          total={total}
        />
      </Suspense>
    </div>
  )
}
