import { Card } from '@/components/ui/card'
import { UploadZone } from '@/components/curador/upload-zone'
import { MetadataForm } from '@/components/curador/metadata-form'
import { LegalIdentification } from '@/components/curador/legal-identification'
import { TaxonomySection } from '@/components/curador/taxonomy-section'
import { MatricesSection } from '@/components/curador/matrices-section'
import { SeoSection } from '@/components/curador/seo-section'
import { ReformAlert } from '@/components/curador/reform-alert'

export default function NuevaCargaPage() {
  return (
    <div className="min-h-full bg-[#F8FAFC] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Columna Izquierda: Formularios y Carga */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* Fuente documental */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                Fuente documental
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <UploadZone />
            </Card>

            {/* Identificación legal */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Identificación legal</h2>
              <LegalIdentification />
            </Card>

            {/* Taxonomía */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Taxonomía y enrutamiento</h2>
              <TaxonomySection />
            </Card>

            {/* Matrices */}
            <MatricesSection />

            {/* SEO */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Enriquecimiento y SEO</h2>
              <SeoSection />
            </Card>
          </div>

          {/* Columna Derecha: Metadatos y Alertas */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Card className="p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-[#00315C]">
                Metadatos
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <MetadataForm />
            </Card>

            <Card className="border-none bg-[#001D3D] p-6 text-white shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[#00315C] p-2">
                  {/* Placeholder for Shield Icon */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#499DFE]"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-[15px] font-semibold">
                    Grafo Legal — Protección activa
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    Escaneando colisiones normativas en tiempo real con la base de datos nacional.
                  </p>
                </div>
              </div>
            </Card>

            <ReformAlert />
          </div>
        </div>
      </div>
    </div>
  )
}
