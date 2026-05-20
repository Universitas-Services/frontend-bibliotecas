import { DocumentPreview } from '@/components/curador/correcciones/document-preview'
import { DocumentMetadataCard } from '@/components/curador/correcciones/document-metadata-card'
import { RevisionHistory } from '@/components/curador/correcciones/revision-history'
import { RequiredCorrections } from '@/components/curador/correcciones/required-corrections'
import { CorrectionsFooter } from '@/components/curador/correcciones/corrections-footer'

export default function CorreccionesPage() {
  return (
    <div className="animate-in fade-in min-h-full bg-[#FAFAFA] pb-24 duration-500">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#C1C7D2] uppercase">
            <span>Mis Correcciones</span>
            <span>{'>'}</span>
            <span className="text-[#005496]">Ley de Alquileres</span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="mb-2 font-['Space_Grotesk'] text-[32px] font-bold tracking-tight text-[#00315C]">
                Revisión de documento
              </h1>
              <p className="text-[14px] font-medium text-[#6B7280]">
                ID: DOC-2023-8472 • Expte. 4829/23
              </p>
            </div>

            <div className="mt-2 flex items-center gap-3 rounded-md border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2.5 shadow-sm md:mt-0">
              <span className="flex items-center justify-center rounded-sm bg-[#FEF08A] p-1 text-[#D97706]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="text-[12px] font-bold tracking-wider text-[#D97706] uppercase">
                DEVUELTO POR REVISOR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-[1600px] p-6 md:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Preview */}
          <div className="lg:col-span-5">
            <DocumentPreview />
          </div>

          {/* Middle Column: Metadata */}
          <div className="lg:col-span-4">
            <DocumentMetadataCard />
          </div>

          {/* Right Column: History & Tasks */}
          <div className="flex flex-col lg:col-span-3">
            <RevisionHistory />
            <div className="flex-1">
              <RequiredCorrections />
            </div>
          </div>
        </div>
      </div>

      <CorrectionsFooter />
    </div>
  )
}
