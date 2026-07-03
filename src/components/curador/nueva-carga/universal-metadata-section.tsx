'use client'

import { useState } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'

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

type UniversalMetadataSectionProps = {
  hidePais?: boolean
  initialValues?: {
    pais?: string
    jerarquiaSuperiorId?: string
    documentoRelacionadoId?: string
  }
}

export function UniversalMetadataSection({
  hidePais = false,
  initialValues,
}: UniversalMetadataSectionProps) {
  const [selectedPais, setSelectedPais] = useState(initialValues?.pais || 'Venezuela')

  return (
    <div className="space-y-5">
      {!hidePais ? (
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
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">
          Jerarquía superior (UUID documento padre)
        </label>
        <Input
          name="jerarquiaSuperiorId"
          defaultValue={initialValues?.jerarquiaSuperiorId || ''}
          placeholder="Opcional — ID del documento del cual depende"
          className="h-11 border-gray-300 bg-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Documento relacionado (UUID)</label>
        <Input
          name="documentoRelacionadoId"
          defaultValue={initialValues?.documentoRelacionadoId || ''}
          placeholder="Opcional — ID de documento relacionado"
          className="h-11 border-gray-300 bg-white"
        />
      </div>
    </div>
  )
}
