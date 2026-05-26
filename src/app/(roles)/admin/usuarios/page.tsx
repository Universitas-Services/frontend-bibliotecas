import { listUsersAction } from '@/app/actions/users'
import { UsersTable } from '@/components/admin/users/users-table'

export default async function AdminUsuariosPage() {
  const result = await listUsersAction()
  const users = result.success ? result.data : []

  return <UsersTable users={users} />
}
