'use client'

import { useState } from 'react'
import { FileText, Info } from 'lucide-react'

import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MetadataFormProps {
  tipoDocumentoNombre: string
  initialValues?: {
    ambitoTerritorial?: string
    numeroGaceta?: string
    pais?: string
    enteEmisor?: string
    fechaPublicacion?: string
  }
}

const COUNTRY_OPTIONS = [
  'Venezuela',
  'Colombia',
  'Ecuador',
  'Perú',
  'Bolivia',
  'Chile',
  'Argentina',
  'Uruguay',
  'Paraguay',
  'Brasil',
  'México',
  'Guatemala',
  'Honduras',
  'El Salvador',
  'Nicaragua',
  'Costa Rica',
  'Panamá',
  'Cuba',
  'República Dominicana',
  'Puerto Rico',
  'España',
  'Estados Unidos',
  'Canadá',
  'Portugal',
  'Francia',
  'Italia',
  'Alemania',
  'Reino Unido',
  'China',
  'Japón',
  'Corea del Sur',
  'India',
  'Australia',
  'Rusia',
  'Sudáfrica',
].map((name) => ({ value: name, label: name }))

export function MetadataForm({ tipoDocumentoNombre, initialValues }: MetadataFormProps) {
  const [ambitoTerritorial, setAmbitoTerritorial] = useState(initialValues?.ambitoTerritorial || '')
  const [numeroGaceta, setNumeroGaceta] = useState(initialValues?.numeroGaceta || '')
  const [selectedPais, setSelectedPais] = useState(initialValues?.pais || 'Venezuela')

  const normalizedTipo = tipoDocumentoNombre.trim().toLowerCase()
  const isLegislacion = normalizedTipo === 'legislación' || normalizedTipo === 'legislacion'

  // No tipo selected yet
  if (!tipoDocumentoNombre) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-[#F8FAFC] py-10 text-center">
        <div className="rounded-lg bg-gray-100 p-3">
          <FileText className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Seleccione un tipo de documento</p>
          <p className="mt-1 text-xs text-gray-400">
            Los campos de metadatos se habilitarán según la clasificación seleccionada arriba.
          </p>
        </div>
      </div>
    )
  }

  // Tipo selected but not "Legislación"
  if (!isLegislacion) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#F6C07B] bg-[#FFF9EE] py-10 text-center">
        <div className="rounded-lg bg-[#FFF4E5] p-3">
          <Info className="h-6 w-6 text-[#D97706]" strokeWidth={1.5} />
        </div>
        <div className="px-4">
          <p className="text-sm font-medium text-[#A8610A]">
            Metadatos para &quot;{tipoDocumentoNombre}&quot;
          </p>
          <p className="mt-1 text-xs text-[#D97706]">
            Los campos de metadatos específicos para este tipo de documento están en desarrollo. Por
            el momento solo están disponibles los campos para Legislación.
          </p>
        </div>
      </div>
    )
  }

  const formatWithThousandSeparator = (value: string) => {
    const digits = value.replace(/[^\d]/g, '')
    if (!digits) return ''
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleGacetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    setNumeroGaceta(raw)
  }

  // Legislación fields
  return (
    <div className="space-y-5">
      {ambitoTerritorial && (
        <input type="hidden" name="ambitoTerritorial" value={ambitoTerritorial} />
      )}

      {/* Ente emisor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          Ente emisor
          <span className="ml-1 text-red-500">*</span>
        </label>
        <Input
          name="enteEmisor"
          required
          defaultValue={initialValues?.enteEmisor || ''}
          placeholder="Ej: Asamblea Nacional, Ministerio de Justicia..."
          className="h-11 border-gray-300 bg-white"
        />
      </div>

      {/* Fecha de publicación + N° Gaceta */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#00315C]">
            Fecha de publicación
            <span className="ml-1 text-red-500">*</span>
          </label>
          <Input
            name="fechaPublicacion"
            required
            type="date"
            defaultValue={
              initialValues?.fechaPublicacion ? initialValues.fechaPublicacion.split('T')[0] : ''
            }
            className="h-11 border-gray-300 bg-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#00315C]">N° de Gaceta Oficial</label>
          <input type="hidden" name="numeroGaceta" value={numeroGaceta} />
          <Input
            value={formatWithThousandSeparator(numeroGaceta)}
            onChange={handleGacetaChange}
            placeholder="Ej: 6.507"
            className="h-11 border-gray-300 bg-white"
          />
        </div>
      </div>

      {/* Ámbito territorial */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          Ámbito territorial
          <span className="ml-1 text-red-500">*</span>
        </label>
        <Select value={ambitoTerritorial || undefined} onValueChange={setAmbitoTerritorial}>
          <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
            <SelectValue placeholder="Seleccione el ámbito..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NACIONAL">Nacional</SelectItem>
            <SelectItem value="ESTADAL">Estadal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* País */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          País
          <span className="ml-1 text-red-500">*</span>
        </label>
        <input type="hidden" name="pais" value={selectedPais} />
        <Combobox
          options={COUNTRY_OPTIONS}
          value={selectedPais}
          onValueChange={setSelectedPais}
          placeholder="Seleccione un país..."
          searchPlaceholder="Buscar país..."
          emptyText="País no encontrado."
        />
      </div>
    </div>
  )
}
