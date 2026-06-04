import { Metadata } from 'next'
import { NuevoTemaForm } from '@/components/admin/temas/nuevo-tema-form'
import { TemasTable } from '@/components/admin/temas/temas-table'
import { MOCK_TEMAS } from '@/components/admin/temas/mock-data'

export const metadata: Metadata = {
  title: 'Gestión de temas principales | Admin',
  description: 'Gestión de temas principales y enrutamiento de revisores',
}

export default function AdminTemasPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 pt-10 lg:p-8">
      {/* Header */}
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

      {/* Formulario de creación */}
      <NuevoTemaForm />

      {/* Tabla Matriz */}
      <TemasTable initialTemas={MOCK_TEMAS} />
    </div>
  )
}
