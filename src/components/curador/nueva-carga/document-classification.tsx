'use client'

import { useEffect, useState } from 'react'
import { Loader2, ChevronRight } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getTemasAction,
  getTiposDocumentoAction,
  getTiposNormaAction,
  type TemaPrincipal,
  type Subcarpeta,
  type CarpetaInterna,
} from '@/app/actions/temas'

export interface ClassificationValues {
  temaPrincipalId: string
  temaPrincipalNombre: string
  tipoDocumentoId: string
  tipoDocumentoNombre: string
  tipoNormaId: string
  tipoNormaNombre: string
}

interface DocumentClassificationProps {
  onChange: (values: ClassificationValues) => void
}

export function DocumentClassification({ onChange }: DocumentClassificationProps) {
  // Data from backend
  const [temas, setTemas] = useState<TemaPrincipal[]>([])
  const [tiposDocumento, setTiposDocumento] = useState<Subcarpeta[]>([])
  const [tiposNorma, setTiposNorma] = useState<CarpetaInterna[]>([])

  // Selected values
  const [selectedTema, setSelectedTema] = useState('')
  const [selectedTipoDoc, setSelectedTipoDoc] = useState('')
  const [selectedTipoNorma, setSelectedTipoNorma] = useState('')

  // Loading states
  const [loadingTemas, setLoadingTemas] = useState(true)
  const [loadingTiposDoc, setLoadingTiposDoc] = useState(false)
  const [loadingTiposNorma, setLoadingTiposNorma] = useState(false)

  // Load temas on mount
  useEffect(() => {
    async function fetchTemas() {
      try {
        const data = await getTemasAction()
        setTemas(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al cargar temas principales:', error)
      } finally {
        setLoadingTemas(false)
      }
    }
    fetchTemas()
  }, [])

  // Load tipos de documento when tema changes
  useEffect(() => {
    if (!selectedTema) return

    async function fetchTiposDoc() {
      setLoadingTiposDoc(true)
      try {
        const data = await getTiposDocumentoAction(selectedTema)
        setTiposDocumento(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al cargar tipos de documento:', error)
      } finally {
        setLoadingTiposDoc(false)
      }
    }
    fetchTiposDoc()
  }, [selectedTema])

  // Load tipos de norma when tipo documento changes
  useEffect(() => {
    if (!selectedTipoDoc) return

    async function fetchTiposNorma() {
      setLoadingTiposNorma(true)
      try {
        const data = await getTiposNormaAction(selectedTipoDoc)
        setTiposNorma(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al cargar tipos de norma:', error)
      } finally {
        setLoadingTiposNorma(false)
      }
    }
    fetchTiposNorma()
  }, [selectedTipoDoc])

  // Notify parent when any value changes
  useEffect(() => {
    const temaObj = temas.find((t) => t.id === selectedTema)
    const tipoDocObj = tiposDocumento.find((td) => td.id === selectedTipoDoc)
    const tipoNormaObj = tiposNorma.find((tn) => tn.id === selectedTipoNorma)

    onChange({
      temaPrincipalId: selectedTema,
      temaPrincipalNombre: temaObj?.nombre ?? '',
      tipoDocumentoId: selectedTipoDoc,
      tipoDocumentoNombre: tipoDocObj?.tipoNorma ?? '',
      tipoNormaId: selectedTipoNorma,
      tipoNormaNombre:
        tipoNormaObj?.nombreCarpeta ||
        ((tipoNormaObj as unknown as Record<string, unknown>)?.nombre as string) ||
        ((tipoNormaObj as unknown as Record<string, unknown>)?.tipoNorma as string) ||
        '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTema, selectedTipoDoc, selectedTipoNorma, temas, tiposDocumento, tiposNorma])

  const getStepStatus = (step: 1 | 2 | 3) => {
    if (step === 1) return selectedTema ? 'completed' : 'active'
    if (step === 2) {
      if (!selectedTema) return 'pending'
      return selectedTipoDoc ? 'completed' : 'active'
    }
    if (!selectedTipoDoc) return 'pending'
    return selectedTipoNorma ? 'completed' : 'active'
  }

  return (
    <div className="space-y-5">
      {/* Hidden inputs for form submission */}
      {selectedTema && <input type="hidden" name="temaPrincipal" value={selectedTema} />}
      {selectedTipoDoc && <input type="hidden" name="tipoDocumento" value={selectedTipoDoc} />}
      {selectedTipoNorma && <input type="hidden" name="tipoNorma" value={selectedTipoNorma} />}

      {/* Breadcrumb progress indicator */}
      <div className="flex items-center gap-2 text-xs">
        <StepIndicator step={1} label="Tema" status={getStepStatus(1)} />
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <StepIndicator step={2} label="Tipo documento" status={getStepStatus(2)} />
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <StepIndicator step={3} label="Tipo norma" status={getStepStatus(3)} />
      </div>

      {/* Step 1: Tema Principal */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          Tema principal
          <span className="ml-1 text-red-500">*</span>
        </label>
        <Select
          value={selectedTema || undefined}
          onValueChange={(val) => {
            const newVal = val === 'none' ? '' : val
            setSelectedTema(newVal)
            setSelectedTipoDoc('')
            setSelectedTipoNorma('')
            setTiposDocumento([])
            setTiposNorma([])
          }}
        >
          <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
            <SelectValue
              placeholder={loadingTemas ? 'Cargando temas...' : 'Seleccione un área temática...'}
            />
          </SelectTrigger>
          <SelectContent>
            {loadingTemas ? (
              <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </div>
            ) : temas.length === 0 ? (
              <SelectItem value="sin-temas" disabled>
                No hay temas disponibles
              </SelectItem>
            ) : (
              <>
                <SelectItem value="none" className="text-gray-500 italic focus:bg-gray-100">
                  Seleccione un área temática...
                </SelectItem>
                {temas.map((tema) => (
                  <SelectItem key={tema.id} value={tema.id}>
                    {tema.nombre}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2: Tipo de Documento */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          Tipo de documento
          <span className="ml-1 text-red-500">*</span>
        </label>
        <Select
          value={selectedTipoDoc || undefined}
          onValueChange={(val) => {
            const newVal = val === 'none' ? '' : val
            setSelectedTipoDoc(newVal)
            setSelectedTipoNorma('')
            setTiposNorma([])
          }}
          disabled={!selectedTema || loadingTiposDoc}
        >
          <SelectTrigger
            className={`h-11 w-full border-gray-300 bg-white ${!selectedTema ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <SelectValue
              placeholder={
                !selectedTema
                  ? 'Seleccione primero un tema...'
                  : loadingTiposDoc
                    ? 'Cargando tipos...'
                    : 'Seleccione un tipo de documento...'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {loadingTiposDoc ? (
              <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </div>
            ) : tiposDocumento.length === 0 ? (
              <SelectItem value="sin-tipos" disabled>
                No hay tipos de documento disponibles
              </SelectItem>
            ) : (
              <>
                <SelectItem value="none" className="text-gray-500 italic focus:bg-gray-100">
                  Seleccione un tipo de documento...
                </SelectItem>
                {tiposDocumento.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.tipoNorma}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Step 3: Tipo de Norma */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          Tipo de norma
          <span className="ml-1 text-red-500">*</span>
        </label>
        <Select
          value={selectedTipoNorma || undefined}
          onValueChange={(val) => setSelectedTipoNorma(val === 'none' ? '' : val)}
          disabled={!selectedTipoDoc || loadingTiposNorma}
        >
          <SelectTrigger
            className={`h-11 w-full border-gray-300 bg-white ${!selectedTipoDoc ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <SelectValue
              placeholder={
                !selectedTipoDoc
                  ? 'Seleccione primero un tipo de documento...'
                  : loadingTiposNorma
                    ? 'Cargando normas...'
                    : 'Seleccione un tipo de norma...'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {loadingTiposNorma ? (
              <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </div>
            ) : tiposNorma.length === 0 ? (
              <SelectItem value="sin-normas" disabled>
                No hay tipos de norma disponibles
              </SelectItem>
            ) : (
              <>
                <SelectItem value="none" className="text-gray-500 italic focus:bg-gray-100">
                  Seleccione un tipo de norma...
                </SelectItem>
                {tiposNorma.map((norma) => (
                  <SelectItem key={norma.id} value={norma.id}>
                    {norma.nombreCarpeta ||
                      ((norma as unknown as Record<string, unknown>).nombre as string) ||
                      ((norma as unknown as Record<string, unknown>).tipoNorma as string) ||
                      'Sin nombre'}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function StepIndicator({
  step,
  label,
  status,
}: {
  step: number
  label: string
  status: 'pending' | 'active' | 'completed'
}) {
  const bgColor =
    status === 'completed'
      ? 'bg-[#005496] text-white'
      : status === 'active'
        ? 'bg-[#B3D4FF] text-[#005496]'
        : 'bg-gray-200 text-gray-500'

  const textColor =
    status === 'completed'
      ? 'text-[#005496] font-semibold'
      : status === 'active'
        ? 'text-[#00315C] font-medium'
        : 'text-gray-400'

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${bgColor}`}
      >
        {status === 'completed' ? '✓' : step}
      </span>
      <span className={textColor}>{label}</span>
    </div>
  )
}
