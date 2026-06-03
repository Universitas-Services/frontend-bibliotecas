import { Metadata } from 'next'
import { NuevoInstrumentoForm } from '@/components/admin/tipo-normas/nuevo-instrumento-form'
import { InstrumentosTable } from '@/components/admin/tipo-normas/instrumentos-table'
import { MOCK_INSTRUMENTOS } from '@/components/admin/tipo-normas/mock-data'

export const metadata: Metadata = {
  title: 'Gestión de tipos de normas | Admin',
  description: 'Estandarización de formatos jurídicos y configuración del motor de filtros.',
}

export default function AdminTipoNormasPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 pt-10 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1e3a5f]">
          Gestión de tipos de normas
          <br />
          (Instrumentos legales)
        </h1>
        <p className="text-lg text-slate-500">
          Estandarización de formatos jurídicos y configuración del motor de filtros.
        </p>
      </div>

      <div className="mb-8 w-full border-b border-slate-200" />

      {/* Grid Layout: Stacked on mobile, 2 columns on large screens */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Formulario de creación (Izquierda en Desktop) */}
        <div className="lg:col-span-4 xl:col-span-4">
          <NuevoInstrumentoForm />
        </div>

        {/* Tabla (Derecha en Desktop) */}
        <div className="lg:col-span-8 xl:col-span-8">
          <InstrumentosTable initialInstrumentos={MOCK_INSTRUMENTOS} />
        </div>
      </div>
    </div>
  )
}
