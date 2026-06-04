import { listUsersAction } from '@/app/actions/users'
import { UsersTable } from '@/components/admin/users/users-table'

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const page = Number(resolvedParams.page) || 1
  const role = typeof resolvedParams.role === 'string' ? resolvedParams.role : undefined

  const result = await listUsersAction({ page, limit: 10, role })
  const paginationData = result.success
    ? result.data
    : { items: [], total: 0, page: 1, limit: 10, totalPages: 0 }

  return <UsersTable data={paginationData} />
}
