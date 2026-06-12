import { Metadata } from 'next'
import { NuevoTemaForm } from '@/components/admin/temas/nuevo-tema-form'
import { TemasTable } from '@/components/admin/temas/temas-table'
import { getPersonalByTemasAction } from '@/app/actions/personal'
import { buildPersonalFromUsers, mergePersonalMaps } from '@/lib/personal-utils'
import { listUsersAction } from '@/app/actions/users'
import { getTemasAction } from '@/app/actions/temas'

export const metadata: Metadata = {
  title: 'Gestión de temas principales | Admin',
  description: 'Gestión de temas principales y enrutamiento de revisores',
}

export default async function AdminTemasPage() {
  const [temasBackend, personalRes, usersRes] = await Promise.all([
    getTemasAction(),
    getPersonalByTemasAction(),
    listUsersAction({ limit: 200 }),
  ])

  const usersFromCreation =
    usersRes.success && Array.isArray(usersRes.data?.items) ? usersRes.data.items : []

  const personalFromUsers = buildPersonalFromUsers(usersFromCreation)
  const personalFromApi = personalRes.success ? personalRes.data : []

  const personalMap = mergePersonalMaps(personalFromApi, personalFromUsers, temasBackend)

  const temas = temasBackend.map((t) => ({
    id: t.id,
    nombre: t.nombre,
    revisoresAsignados: (personalMap.get(t.id) || []).map((u) => ({
      id: u.id,
      nombre: u.nombre,
      certificacionNivel2: false,
    })),
    activo: true,
  }))

  return (
    <div className="mx-auto max-w-5xl p-6 pt-10 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1e3a5f]">
          Gestión de temas principales y<br />
          enrutamiento de revisores
        </h1>
        <p className="text-lg text-slate-500">
          Creación de áreas temáticas y asignación estratégica de especialistas.
        </p>
      </div>

      <div className="mb-8 w-full border-b border-slate-200" />

      <NuevoTemaForm />

      <TemasTable initialTemas={temas} />
    </div>
  )
}
