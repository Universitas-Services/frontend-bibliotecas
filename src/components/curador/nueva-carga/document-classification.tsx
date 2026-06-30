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
  getCarpetasInternasHijosAction,
  type TemaPrincipal,
  type Subcarpeta,
  type CarpetaInterna,
} from '@/app/actions/temas'
import { getTipoNormaDisplayName } from '@/lib/temas-taxonomy'

export interface ClassificationValues {
  temaPrincipalId: string
  temaPrincipalNombre: string
  tipoDocumentoId: string
  tipoDocumentoNombre: string
  carpetaInternaId: string
  carpetaPathNames: string[]
}

interface DocumentClassificationProps {
  onChange: (values: ClassificationValues) => void
  initialValues?: Partial<ClassificationValues> & {
    subcarpetaNormaId?: string
    carpetaInternaId?: string
  }
}

type CarpetaLevel = {
  options: CarpetaInterna[]
  selectedId: string
  loading: boolean
}

function getCarpetaLabel(carpeta: CarpetaInterna): string {
  return getTipoNormaDisplayName(carpeta) || 'Sin nombre'
}

export function DocumentClassification({ onChange, initialValues }: DocumentClassificationProps) {
  const [temas, setTemas] = useState<TemaPrincipal[]>([])
  const [tiposDocumento, setTiposDocumento] = useState<Subcarpeta[]>([])
  const [carpetaLevels, setCarpetaLevels] = useState<CarpetaLevel[]>([])

  const [selectedTema, setSelectedTema] = useState(initialValues?.temaPrincipalId || '')
  const [selectedTipoDoc, setSelectedTipoDoc] = useState(
    initialValues?.tipoDocumentoId || initialValues?.subcarpetaNormaId || '',
  )
  const [leafCarpetaId, setLeafCarpetaId] = useState(initialValues?.carpetaInternaId || '')

  const [loadingTemas, setLoadingTemas] = useState(true)
  const [loadingTiposDoc, setLoadingTiposDoc] = useState(false)

  async function loadRootCarpetas(subcarpetaId: string) {
    setCarpetaLevels([{ options: [], selectedId: '', loading: true }])
    setLeafCarpetaId('')
    try {
      const data = await getTiposNormaAction(subcarpetaId)
      setCarpetaLevels([{ options: data, selectedId: '', loading: false }])
    } catch (error) {
      console.error('Error al cargar carpetas internas:', error)
      setCarpetaLevels([])
    }
  }

  useEffect(() => {
    async function fetchTemas() {
      try {
        const data = await getTemasAction()
        const temasList = Array.isArray(data) ? data : []
        setTemas(temasList)

        if (!selectedTema && initialValues?.temaPrincipalNombre) {
          const match = temasList.find((t) => t.nombre === initialValues.temaPrincipalNombre)
          if (match) setSelectedTema(match.id)
        }
      } catch (error) {
        console.error('Error al cargar temas principales:', error)
      } finally {
        setLoadingTemas(false)
      }
    }
    fetchTemas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedTema) return

    async function fetchTiposDoc() {
      setLoadingTiposDoc(true)
      try {
        const data = await getTiposDocumentoAction(selectedTema)
        const tiposList = Array.isArray(data) ? data : []
        setTiposDocumento(tiposList)

        let tipoDocId = selectedTipoDoc
        if (!tipoDocId && initialValues?.tipoDocumentoNombre) {
          const match = tiposList.find((td) => td.tipoNorma === initialValues.tipoDocumentoNombre)
          if (match) {
            tipoDocId = match.id
            setSelectedTipoDoc(match.id)
          }
        }

        if (tipoDocId) {
          await loadRootCarpetas(tipoDocId)
        }
      } catch (error) {
        console.error('Error al cargar tipos de documento:', error)
      } finally {
        setLoadingTiposDoc(false)
      }
    }
    fetchTiposDoc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTema])

  const handleTipoDocChange = (val: string) => {
    const newVal = val === 'none' ? '' : val
    setSelectedTipoDoc(newVal)
    setCarpetaLevels([])
    setLeafCarpetaId('')
    if (newVal) {
      void loadRootCarpetas(newVal)
    }
  }

  const handleCarpetaLevelChange = async (levelIndex: number, carpetaId: string) => {
    const newLevels = carpetaLevels.slice(0, levelIndex + 1)
    newLevels[levelIndex] = { ...newLevels[levelIndex], selectedId: carpetaId }

    setCarpetaLevels([...newLevels, { options: [], selectedId: '', loading: true }])
    setLeafCarpetaId('')

    try {
      const selectedCarpeta = newLevels[levelIndex].options.find((opt) => opt.id === carpetaId)
      let hijos = selectedCarpeta?.children ?? []

      if (hijos.length === 0) {
        hijos = await getCarpetasInternasHijosAction(carpetaId)
      }

      if (hijos.length > 0) {
        setCarpetaLevels([...newLevels, { options: hijos, selectedId: '', loading: false }])
      } else {
        setCarpetaLevels(newLevels)
        setLeafCarpetaId(carpetaId)
      }
    } catch (error) {
      console.error('Error al cargar hijos de carpeta:', error)
      setCarpetaLevels(newLevels)
      setLeafCarpetaId(carpetaId)
    }
  }

  useEffect(() => {
    const temaObj = temas.find((t) => t.id === selectedTema)
    const tipoDocObj = tiposDocumento.find((td) => td.id === selectedTipoDoc)

    const pathNames: string[] = []
    for (const level of carpetaLevels) {
      if (!level.selectedId) continue
      const match = level.options.find((opt) => opt.id === level.selectedId)
      if (match) pathNames.push(getCarpetaLabel(match))
    }

    onChange({
      temaPrincipalId: selectedTema,
      temaPrincipalNombre: temaObj?.nombre ?? initialValues?.temaPrincipalNombre ?? '',
      tipoDocumentoId: selectedTipoDoc,
      tipoDocumentoNombre: tipoDocObj?.tipoNorma ?? initialValues?.tipoDocumentoNombre ?? '',
      carpetaInternaId: leafCarpetaId,
      carpetaPathNames: pathNames,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTema, selectedTipoDoc, carpetaLevels, leafCarpetaId, temas, tiposDocumento])

  const getStepStatus = (step: 1 | 2 | 3) => {
    if (step === 1) return selectedTema ? 'completed' : 'active'
    if (step === 2) {
      if (!selectedTema) return 'pending'
      return selectedTipoDoc ? 'completed' : 'active'
    }
    if (!selectedTipoDoc) return 'pending'
    return leafCarpetaId ? 'completed' : 'active'
  }

  return (
    <div className="space-y-5">
      {selectedTipoDoc && <input type="hidden" name="subcarpetaNormaId" value={selectedTipoDoc} />}
      {leafCarpetaId && <input type="hidden" name="carpetaInternaId" value={leafCarpetaId} />}

      <div className="flex items-center gap-2 text-xs">
        <StepIndicator step={1} label="Tema" status={getStepStatus(1)} />
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <StepIndicator step={2} label="Tipo documental" status={getStepStatus(2)} />
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <StepIndicator step={3} label="Clasificación interna" status={getStepStatus(3)} />
      </div>

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
            setTiposDocumento([])
            setCarpetaLevels([])
            setLeafCarpetaId('')
          }}
        >
          <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
            <SelectValue
              placeholder={loadingTemas ? 'Cargando temas...' : 'Seleccione un área temática...'}
            />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-[var(--radix-select-trigger-width)]"
          >
            {loadingTemas ? (
              <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </div>
            ) : (
              temas.map((tema) => (
                <SelectItem key={tema.id} value={tema.id}>
                  {tema.nombre}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          Tipo documental
          <span className="ml-1 text-red-500">*</span>
        </label>
        <Select
          value={selectedTipoDoc || undefined}
          onValueChange={handleTipoDocChange}
          disabled={!selectedTema || loadingTiposDoc}
        >
          <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
            <SelectValue
              placeholder={
                !selectedTema
                  ? 'Seleccione primero un tema...'
                  : loadingTiposDoc
                    ? 'Cargando tipos...'
                    : 'Seleccione un tipo documental...'
              }
            />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-[var(--radix-select-trigger-width)]"
          >
            {tiposDocumento.map((tipo) => (
              <SelectItem key={tipo.id} value={tipo.id}>
                {tipo.tipoNorma}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {carpetaLevels.map((level, index) => (
        <div key={`carpeta-level-${index}`} className="space-y-2">
          <label className="text-sm font-medium text-[#00315C]">
            {index === 0 ? 'Clasificación interna' : `Subnivel ${index + 1}`}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <Select
            value={level.selectedId || undefined}
            onValueChange={(val) => handleCarpetaLevelChange(index, val)}
            disabled={level.loading || level.options.length === 0}
          >
            <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
              <SelectValue
                placeholder={
                  level.loading
                    ? 'Cargando...'
                    : level.options.length === 0
                      ? 'Sin opciones disponibles'
                      : 'Seleccione...'
                }
              />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)]"
            >
              {level.loading ? (
                <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </div>
              ) : (
                level.options.map((carpeta) => (
                  <SelectItem key={carpeta.id} value={carpeta.id}>
                    {getCarpetaLabel(carpeta)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      ))}

      {leafCarpetaId ? (
        <p className="text-xs text-green-700">
          Clasificación completa — nivel final seleccionado
          {carpetaLevels.length > 1 ? ` (${carpetaLevels.length} niveles)` : ''}.
        </p>
      ) : selectedTipoDoc && carpetaLevels.length > 0 ? (
        <p className="text-xs text-gray-500">
          Continúe seleccionando subniveles hasta que no aparezcan más opciones.
        </p>
      ) : null}
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
