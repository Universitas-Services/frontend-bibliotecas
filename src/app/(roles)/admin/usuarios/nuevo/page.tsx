import { listTemasPrincipalesAction } from '@/app/actions/users'
import { CreateUserForm } from '@/components/admin/users/create-user-form'

export default async function AdminNuevoUsuarioPage() {
  const temasResult = await listTemasPrincipalesAction()
  const temas = temasResult.success ? temasResult.data : []

  return <CreateUserForm temas={temas} />
}
