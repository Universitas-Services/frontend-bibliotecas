'use client'

import { useRef, useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { uploadDocumentAction } from '@/app/actions/documents'
import { createMetadataAction, type CreateMetadataPayload } from '@/app/actions/metadatas'
import {
  formatUploadValidationIssues,
  validateDocumentUploadForm,
} from '@/lib/document-upload-validation'
import {
  DocumentClassification,
  type ClassificationValues,
} from '@/components/curador/nueva-carga/document-classification'
import { LegalIdentification } from '@/components/curador/nueva-carga/legal-identification'
import { MatricesSection } from '@/components/curador/nueva-carga/matrices-section'
import { MetadataForm } from '@/components/curador/nueva-carga/metadata-form'
import { ReformAlert } from '@/components/curador/nueva-carga/reform-alert'
import { SeoSection } from '@/components/curador/nueva-carga/seo-section'
import { TaxonomySection } from '@/components/curador/nueva-carga/taxonomy-section'
import { UploadZone } from '@/components/curador/nueva-carga/upload-zone'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function NuevaCargaPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()

  // Classification state from child component
  const [classification, setClassification] = useState<ClassificationValues>({
    temaPrincipalId: '',
    temaPrincipalNombre: '',
    tipoDocumentoId: '',
    tipoDocumentoNombre: '',
    tipoNormaId: '',
    tipoNormaNombre: '',
  })

  const handleClassificationChange = useCallback((values: ClassificationValues) => {
    setClassification(values)
  }, [])

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

    // Extract categories
    const categorias = outbound.getAll('categoriaIds')
    // Remove from outbound so it doesn't mess with other parts, we will handle it in uploadFormData

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
      // Step 1: Upload the document
      // Create a clean FormData for the upload endpoint to avoid "property should not exist" errors
      const uploadFormData = new FormData()
      uploadFormData.set('file', selectedFile, selectedFile.name)
      uploadFormData.set('titulo', (outbound.get('titulo') as string) || '')
      uploadFormData.set('tituloIntegro', (outbound.get('tituloIntegro') as string) || '')
      uploadFormData.set('nombreBreve', (outbound.get('nombreBreve') as string) || '')

      // Añadimos los campos que el backend exige obligatoriamente en el endpoint de subida
      uploadFormData.set(
        'temaPrincipal',
        classification.temaPrincipalNombre || (outbound.get('temaPrincipal') as string) || '',
      )
      uploadFormData.set(
        'tipoNorma',
        classification.tipoNormaNombre || (outbound.get('tipoNorma') as string) || '',
      )
      uploadFormData.set('enteEmisor', (outbound.get('enteEmisor') as string) || '')
      uploadFormData.set('fechaPublicacion', (outbound.get('fechaPublicacion') as string) || '')

      // Send multiple 'categoriaIds' fields so the backend parses it as an array
      categorias.forEach((cat) => {
        if (cat) uploadFormData.append('categoriaIds', cat)
      })

      const uploadResponse = await uploadDocumentAction(uploadFormData)

      if (uploadResponse.error) {
        const isAuth =
          uploadResponse.status === 401 ||
          uploadResponse.code === 'TOKEN_EXPIRED' ||
          uploadResponse.code === 'NO_TOKEN'
        const statusLabel = uploadResponse.status ? ` (${uploadResponse.status})` : ''
        toast.error(`Error al subir el documento${statusLabel}`, {
          description: [uploadResponse.error, uploadResponse.details].filter(Boolean).join('\n'),
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

      // Step 2: Extract documentoId from the upload response
      const uploadData = uploadResponse.data as Record<string, unknown> | null
      const documentoId =
        (uploadData?.id as string) ||
        (uploadData?.documentoId as string) ||
        (uploadData?._id as string) ||
        ''

      if (!documentoId) {
        toast.warning(
          'Documento subido, pero no se pudo obtener el ID para guardar los metadatos.',
          {
            duration: 10000,
          },
        )
        setTimeout(() => {
          router.push('/curador/gestion-documental')
        }, 800)
        return
      }

      // Step 3: Create metadata
      const metadataPayload: CreateMetadataPayload = {
        documentoId,
        temaPrincipal:
          classification.temaPrincipalNombre || (outbound.get('temaPrincipal') as string) || '',
        tipoDocumento:
          classification.tipoDocumentoNombre || (outbound.get('tipoDocumento') as string) || '',
        tipoNorma: classification.tipoNormaNombre || (outbound.get('tipoNorma') as string) || '',
        enteEmisor: (outbound.get('enteEmisor') as string) || '',
        fechaPublicacion: (outbound.get('fechaPublicacion') as string) || '',
        numeroGaceta: (outbound.get('numeroGaceta') as string) || '',
        ambitoTerritorial: ((outbound.get('ambitoTerritorial') as string) || 'NACIONAL') as
          | 'NACIONAL'
          | 'ESTADAL',
        pais: (outbound.get('pais') as string) || '',
      }

      const metadataResponse = await createMetadataAction(metadataPayload)

      if (!metadataResponse.success) {
        toast.warning(
          'Documento subido correctamente, pero hubo un error al guardar los metadatos.',
          {
            description: metadataResponse.error,
            duration: 15000,
          },
        )
      } else {
        toast.success('¡Documento cargado y metadatos guardados exitosamente!')
      }

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
          {/* Main column */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* 1. Clasificación del documento (NEW - first section) */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                Clasificación del documento
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <DocumentClassification onChange={handleClassificationChange} />
            </Card>

            {/* 2. Fuente documental (Upload) */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                Fuente documental
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <UploadZone disabled={isPending} onFileSelected={setSelectedFile} />
            </Card>

            {/* 3. Identificación legal */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Identificación legal</h2>
              <LegalIdentification />
            </Card>

            {/* 4. Metadatos del documento (MOVED from sidebar to main body) */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                Metadatos del documento
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <MetadataForm tipoDocumentoNombre={classification.tipoDocumentoNombre} />
            </Card>

            {/* 5. Categorías */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Categorías</h2>
              <TaxonomySection />
            </Card>

            {/* 6. Matrices */}
            <MatricesSection />

            {/* 7. SEO */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Enriquecimiento y SEO</h2>
              <SeoSection />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Submit button */}
            <Card className="p-6 shadow-sm">
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full bg-[#005496] text-base font-semibold text-white hover:bg-[#00315C]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar documento'
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-gray-500">
                El documento será enviado para revisión automática.
              </p>
            </Card>

            {/* Grafo Legal card */}
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
