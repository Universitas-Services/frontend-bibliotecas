'use client'

import { useRef, useState, useTransition, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import {
  uploadDocumentAction,
  uploadReformaAction,
  updateDocumentAction,
  getDocumentByIdAction,
} from '@/app/actions/documents'
import { publicarBorradorAction, uploadBorradorAction } from '@/app/actions/curador-documents'
import { getNotasByDocumentoAction } from '@/app/actions/notas-internas'
import { mapBackendStatus } from '@/lib/document-status'
import {
  createMetadataAction,
  updateMetadataAction,
  getMetadataByDocumentIdAction,
  type CreateMetadataPayload,
} from '@/app/actions/metadatas'
import { buildDocumentMultipartPayload } from '@/lib/document-form-data'
import { extractDocumentMatrices } from '@/lib/document-matrices'
import {
  formatUploadValidationIssues,
  validateBorradorForm,
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
import { CuradorBottomBar } from '@/components/curador/curador-bottom-bar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

type InitialCategoria = string | { id?: string; _id?: string; nombre?: string }

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function readBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function readInitialCategorias(value: unknown): InitialCategoria[] | undefined {
  if (!Array.isArray(value)) return undefined

  return value.filter(
    (item): item is InitialCategoria =>
      typeof item === 'string' || (typeof item === 'object' && item !== null),
  )
}

export default function NuevaCargaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const reenviarFromUrl = searchParams.get('reenviar') === '1'

  const formRef = useRef<HTMLFormElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()

  // Edit mode state
  const [initialData, setInitialData] = useState<{
    documento: Record<string, unknown>
    metadata: Record<string, unknown> | null
  } | null>(null)
  const [isLoadingInitial, setIsLoadingInitial] = useState(!!editId)
  const [shouldReenviar, setShouldReenviar] = useState(reenviarFromUrl)

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

  const initialMatrices = initialData
    ? extractDocumentMatrices(initialData.documento)
    : { matrizAId: undefined, matrizBIds: [] as string[] }

  // Fetch initial data if in edit mode
  useEffect(() => {
    if (!editId) return

    async function loadInitialData() {
      try {
        const [docRes, metaRes, notasRes] = await Promise.all([
          getDocumentByIdAction(editId!),
          getMetadataByDocumentIdAction(editId!),
          getNotasByDocumentoAction(editId!),
        ])

        if (docRes.success) {
          const documento = (docRes.data ?? {}) as Record<string, unknown>
          setInitialData({
            documento,
            metadata: metaRes.success && metaRes.data ? metaRes.data : null,
          })

          const estado = mapBackendStatus(String(documento.estado || ''))
          const tieneNotas = notasRes.success && notasRes.data.length > 0
          if (!reenviarFromUrl && estado === 'borrador' && tieneNotas) {
            setShouldReenviar(true)
          }
          // Pre-populate classification names so DocumentClassification can auto-select IDs
          if (metaRes.success && metaRes.data) {
            setClassification((prev) => ({
              ...prev,
              temaPrincipalNombre: (metaRes.data.temaPrincipal as string) || '',
              tipoDocumentoNombre: (metaRes.data.tipoDocumento as string) || '',
              tipoNormaNombre: (metaRes.data.tipoNorma as string) || '',
            }))
          }
        } else {
          toast.error('Error al cargar el documento original', { description: docRes.error })
        }
      } catch (err) {
        console.error('Error fetching edit data:', err)
        toast.error('Error de conexión al cargar los datos')
      } finally {
        setIsLoadingInitial(false)
      }
    }

    loadInitialData()
  }, [editId])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isPending) {
      return
    }

    if (!selectedFile && !editId) {
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

    if (classification.tipoDocumentoId) {
      outbound.set('subcarpetaNormaId', classification.tipoDocumentoId)
    }

    if (selectedFile) {
      outbound.set('file', selectedFile, selectedFile.name)
    }

    const validationIssues = validateDocumentUploadForm(outbound)
    // Ignore file validation if we are editing and no new file was selected
    const filteredIssues =
      editId && !selectedFile
        ? validationIssues.filter((i) => i.field !== 'file')
        : validationIssues

    if (filteredIssues.length > 0) {
      toast.error('Complete los campos obligatorios', {
        description: formatUploadValidationIssues(filteredIssues),
        duration: 10000,
      })
      return
    }

    if (!classification.tipoDocumentoId?.trim()) {
      toast.error('Complete la clasificación: tema y tipo de documento son requeridos.')
      return
    }

    const isReforma = outbound.get('esReforma') === 'true'
    const leyViejaId = String(outbound.get('leyViejaId') ?? '').trim()

    if (isReforma && !leyViejaId) {
      toast.error('Seleccione la ley original que está siendo reformada.')
      return
    }

    if (isReforma && editId) {
      toast.error('La edición como reforma aún no está disponible. Cree una nueva carga.')
      return
    }

    startTransition(async () => {
      const uploadFormData = buildDocumentMultipartPayload({
        outbound,
        categorias,
        classification,
        file: selectedFile,
      })

      // Execute Update, Reforma or Upload
      const documentResponse = editId
        ? await updateDocumentAction(editId, uploadFormData)
        : isReforma
          ? await uploadReformaAction(uploadFormData)
          : await uploadDocumentAction(uploadFormData)

      if (documentResponse.error) {
        const isAuth =
          documentResponse.status === 401 ||
          documentResponse.code === 'TOKEN_EXPIRED' ||
          documentResponse.code === 'NO_TOKEN'
        const statusLabel = documentResponse.status ? ` (${documentResponse.status})` : ''
        toast.error(`Error al ${editId ? 'actualizar' : 'subir'} el documento${statusLabel}`, {
          description: [documentResponse.error, documentResponse.details]
            .filter(Boolean)
            .join('\n'),
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

      // Step 2: Extract documentoId
      const responseData = documentResponse.data as Record<string, unknown> | null
      const documentoId =
        editId ||
        (responseData?.id as string) ||
        (responseData?.documentoId as string) ||
        (responseData?._id as string) ||
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

      const metadataId = readString(initialData?.metadata?.id)
      const metadataResponse =
        editId && metadataId
          ? await updateMetadataAction(metadataId, metadataPayload)
          : await createMetadataAction(metadataPayload)

      if (!metadataResponse.success) {
        toast.warning(
          `Documento ${editId ? 'actualizado' : 'subido'} correctamente, pero hubo un error al guardar los metadatos.`,
          {
            description: metadataResponse.error,
            duration: 15000,
          },
        )
      } else if (editId && shouldReenviar) {
        const publicarResult = await publicarBorradorAction(documentoId, {
          subcarpetaNormaId: classification.tipoDocumentoId || '',
          carpetaInternaId: classification.tipoNormaId || undefined,
          categoriaIds: categorias.map(String).filter((id) => id.trim()),
        })
        if (!publicarResult.success) {
          toast.warning('Cambios guardados, pero no se pudo reenviar a revisión.', {
            description: [publicarResult.error, publicarResult.details].filter(Boolean).join('\n'),
            duration: 15000,
          })
          setTimeout(() => {
            router.push('/curador/gestion-documental')
          }, 800)
          return
        }
        toast.success('Documento corregido y enviado a revisión correctamente.')
      } else {
        toast.success(
          `¡Documento ${editId ? 'actualizado' : 'cargado'} y metadatos guardados exitosamente!`,
        )
      }

      setTimeout(() => {
        router.push('/curador/gestion-documental')
      }, 800)
    })
  }

  const handleSaveBorrador = () => {
    if (isPending) return

    if (!selectedFile && !editId) {
      toast.error('Debe seleccionar un archivo PDF o DOC antes de guardar el borrador.')
      return
    }

    const form = formRef.current
    if (!form) return

    const outbound = new FormData(form)
    const tituloIntegro = (outbound.get('tituloIntegro') as string) || ''

    if (!outbound.get('titulo') && tituloIntegro) {
      outbound.set('titulo', tituloIntegro)
    }
    if (!outbound.get('nombreBreve')) {
      outbound.set('nombreBreve', tituloIntegro || 'Sin alias')
    }

    const validationIssues = validateBorradorForm(outbound)
    if (validationIssues.length > 0) {
      toast.error('Complete los campos obligatorios', {
        description: formatUploadValidationIssues(validationIssues),
        duration: 10000,
      })
      return
    }

    startTransition(async () => {
      const categorias = outbound.getAll('categoriaIds')
      const borradorFormData = buildDocumentMultipartPayload({
        outbound,
        categorias,
        classification,
        file: selectedFile,
      })

      const response = editId
        ? await updateDocumentAction(editId, borradorFormData)
        : await uploadBorradorAction(borradorFormData)

      if (response.error) {
        const isAuth =
          response.status === 401 ||
          response.code === 'TOKEN_EXPIRED' ||
          response.code === 'NO_TOKEN'
        toast.error('Error al guardar el borrador', {
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

      toast.success('Borrador guardado correctamente.')
      setTimeout(() => {
        router.push('/curador/gestion-documental?estado=borradores')
      }, 800)
    })
  }

  if (isLoadingInitial) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#005496]" />
        <p className="text-sm text-gray-500">Cargando datos del documento...</p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      id="nueva-carga-form"
      onSubmit={handleSubmit}
      className="min-h-full bg-[#F8FAFC] p-8"
    >
      <div className="mx-auto max-w-7xl pb-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#C1C7D2] uppercase">
            <Link href="/curador/nueva-carga" className="hover:text-[#005496]">
              Nueva carga
            </Link>
            <span>{'>'}</span>
            <span className="text-[#005496]">
              {editId ? 'Editar documento' : 'Nuevo documento'}
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-[28px] font-bold tracking-tight text-[#00315C] md:text-[32px]">
            Ingesta y clasificación avanzada
          </h1>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Main column */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* 1. Clasificación del documento (NEW - first section) */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                {editId ? 'Clasificación del documento (Edición)' : 'Clasificación del documento'}
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <DocumentClassification
                onChange={handleClassificationChange}
                initialValues={
                  initialData?.metadata
                    ? {
                        temaPrincipalNombre: readString(initialData.metadata.temaPrincipal),
                        tipoDocumentoNombre: readString(initialData.metadata.tipoDocumento),
                        tipoNormaNombre: readString(initialData.metadata.tipoNorma),
                      }
                    : undefined
                }
              />
            </Card>

            {/* 2. Fuente documental (Upload) */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                Fuente documental
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <UploadZone
                disabled={isPending}
                onFileSelected={setSelectedFile}
                initialFileName={editId ? 'Documento original cargado' : undefined}
                initialOcr={readBoolean(initialData?.documento?.soloLecturaImagen)}
              />
            </Card>

            {/* 3. Identificación legal */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Identificación legal</h2>
              <LegalIdentification
                initialValues={
                  initialData?.documento
                    ? {
                        tituloIntegro:
                          readString(initialData.documento.tituloIntegro) ||
                          readString(initialData.documento.titulo),
                        nombreBreve: readString(initialData.documento.nombreBreve),
                      }
                    : undefined
                }
              />
            </Card>

            {/* 4. Metadatos del documento (MOVED from sidebar to main body) */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#00315C]">
                Metadatos del documento
                <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  Requerido
                </span>
              </h2>
              <MetadataForm
                tipoDocumentoNombre={classification.tipoDocumentoNombre}
                initialValues={
                  initialData?.metadata
                    ? {
                        ambitoTerritorial: readString(initialData.metadata.ambitoTerritorial),
                        numeroGaceta: readString(initialData.metadata.numeroGaceta),
                        pais: readString(initialData.metadata.pais),
                        enteEmisor: readString(initialData.metadata.enteEmisor),
                        fechaPublicacion: readString(initialData.metadata.fechaPublicacion),
                      }
                    : undefined
                }
              />
            </Card>

            {/* 5. Categorías */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Categorías</h2>
              <TaxonomySection
                initialCategorias={
                  readInitialCategorias(initialData?.documento?.categorias) ||
                  readInitialCategorias(initialData?.documento?.categoriaIds)
                }
              />
            </Card>

            {/* 6. Matrices */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Matrices de vinculación</h2>
              <MatricesSection
                initialMatrizAId={initialMatrices.matrizAId}
                initialMatrizBIds={initialMatrices.matrizBIds}
              />
            </Card>

            {/* 7. SEO */}
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-[#00315C]">Enriquecimiento y SEO</h2>
              <SeoSection />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-4">
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

        {shouldReenviar && editId ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Este documento fue devuelto con correcciones. Al guardar, se reenviará automáticamente a
            revisión del administrador.
          </div>
        ) : null}

        <CuradorBottomBar variant="inline">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="h-11 px-6 text-sm font-semibold"
            onClick={handleSaveBorrador}
          >
            Guardar borrador
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 bg-[#005496] px-8 text-sm font-semibold text-white hover:bg-[#00315C]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editId && shouldReenviar
                  ? 'Reenviando...'
                  : editId
                    ? 'Actualizando...'
                    : 'Publicando...'}
              </>
            ) : editId && shouldReenviar ? (
              'Guardar y reenviar a revisión'
            ) : editId ? (
              'Guardar cambios'
            ) : (
              'Publicar documento'
            )}
          </Button>
        </CuradorBottomBar>
      </div>
    </form>
  )
}
