'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { uploadDocumentAction } from '@/app/actions/documents'
import {
  formatUploadValidationIssues,
  validateDocumentUploadForm,
} from '@/lib/document-upload-validation'
import { LegalIdentification } from '@/components/curador/nueva-carga/legal-identification'
import { MatricesSection } from '@/components/curador/nueva-carga/matrices-section'
import { MetadataForm } from '@/components/curador/nueva-carga/metadata-form'
import { ReformAlert } from '@/components/curador/nueva-carga/reform-alert'
import { SeoSection } from '@/components/curador/nueva-carga/seo-section'
import { TaxonomySection } from '@/components/curador/nueva-carga/taxonomy-section'
import { UploadZone } from '@/components/curador/nueva-carga/upload-zone'
import { Card } from '@/components/ui/card'

export default function NuevaCargaPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isPending) {
      return
    }

    if (!selectedFile) {
      toast.error('Debe seleccionar un archivo PDF o DOC antes de publicar.')
      return
    }

    const form = formRef.current ?? event.currentTarget
    const outbound = new FormData(form)

    // 1. El backend requiere 'titulo' y 'tituloIntegro'
    const tituloIntegro = (outbound.get('tituloIntegro') as string) || ''
    if (!outbound.get('titulo') && tituloIntegro) {
      outbound.set('titulo', tituloIntegro)
    }

    // 2. El backend requiere 'nombreBreve'
    if (!outbound.get('nombreBreve')) {
      outbound.set('nombreBreve', tituloIntegro || 'Sin alias')
    }

    // 3. El backend requiere 'categoriaIds' como string separado por comas
    const categorias = outbound.getAll('categoriaIds')
    if (categorias.length > 0) {
      outbound.delete('categoriaIds')
      outbound.set('categoriaIds', categorias.join(','))
    } else {
      outbound.set('categoriaIds', '')
    }

    // 4. El backend requiere 'temaPrincipal'
    if (!outbound.get('temaPrincipal')) {
      outbound.set('temaPrincipal', 'General')
    }

    outbound.set('file', selectedFile, selectedFile.name)

    const validationIssues = validateDocumentUploadForm(outbound)
    if (validationIssues.length > 0) {
      toast.error('Complete los campos obligatorios', {
        description: formatUploadValidationIssues(validationIssues),
        duration: 10000,
      })
      return
    }

    startTransition(async () => {
      const response = await uploadDocumentAction(outbound)

      if (response.error) {
        const isAuth =
          response.status === 401 ||
          response.code === 'TOKEN_EXPIRED' ||
          response.code === 'NO_TOKEN'
        const statusLabel = response.status ? ` (${response.status})` : ''
        toast.error(`Error al subir el documento${statusLabel}`, {
          description: [response.error, response.details].filter(Boolean).join('\n'),
          duration: 15000,
          action: isAuth
            ? {
                label: 'Iniciar sesión',
                onClick: () => router.push('/login?logout=1'),
              }
            : undefined,
        })
        return
      }

      toast.success('¡Documento cargado exitosamente!')
      setTimeout(() => {
        router.push('/curador/gestion-documental')
      }, 800)
    })
  }

  return (
    <form
      ref={formRef}
      id="nueva-carga-form"
      onSubmit={handleSubmit}
      className="min-h-full bg-[#F8FAFC] p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                Fuente documental
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <UploadZone disabled={isPending} onFileSelected={setSelectedFile} />
            </Card>

            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Identificación legal</h2>
              <LegalIdentification />
            </Card>

            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Taxonomía y enrutamiento</h2>
              <TaxonomySection />
            </Card>

            <MatricesSection />

            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Enriquecimiento y SEO</h2>
              <SeoSection />
            </Card>
          </div>

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
    </form>
  )
}
