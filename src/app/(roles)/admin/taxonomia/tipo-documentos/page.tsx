import { Metadata } from 'next'
import { NuevoTipoDocumentoForm } from '@/components/admin/tipo-documentos/nuevo-tipo-documento-form'
import { TiposDocumentoTable } from '@/components/admin/tipo-documentos/tipos-documento-table'
import { getTemasAction } from '@/app/actions/temas'

export const metadata: Metadata = {
  title: 'Gestión de tipos de documentos | Admin',
  description: 'Clasificación de documentos bajo temas principales.',
}

export default async function AdminTipoDocumentosPage() {
  const temas = await getTemasAction()

  return (
    <div className="mx-auto max-w-7xl p-4 pt-10 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1e3a5f]">
          Tipos de documentos
        </h1>
        <p className="text-lg text-slate-500">
          Clasificación de documentos bajo temas principales (ej. Legislación, Jurisprudencia).
        </p>
      </div>

      <div className="mb-8 w-full border-b border-slate-200" />

      {/* Grid Layout: Stacked on mobile, 2 columns on large screens */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Formulario de creación */}
        <div className="lg:col-span-5 xl:col-span-4">
          <NuevoTipoDocumentoForm temas={temas} />
        </div>

        {/* Tabla */}
        <div className="lg:col-span-7 xl:col-span-8">
          <TiposDocumentoTable temas={temas} />
        </div>
      </div>
    </div>
  )
}
