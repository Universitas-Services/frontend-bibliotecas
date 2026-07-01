'use client'

import { useEffect, useState } from 'react'
import { FileText, Info } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  METADATA_SCHEMAS,
  type MetadataFieldDefinition,
  type MetadataSchema,
} from '@/lib/metadata-schemas'

type MetadataFormDynamicProps = {
  schemaKey: string | null
  initialValues?: Record<string, string>
  onChange?: (values: Record<string, string>) => void
}

function renderField(
  field: MetadataFieldDefinition,
  values: Record<string, string>,
  onFieldChange: (key: string, value: string) => void,
) {
  const value = values[field.key] ?? ''
  const options =
    field.getOptions && field.dependsOn ? field.getOptions(values) : (field.options ?? [])

  if (field.type === 'select') {
    return (
      <Select value={value || undefined} onValueChange={(val) => onFieldChange(field.key, val)}>
        <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
          <SelectValue placeholder={`Seleccione ${field.label.toLowerCase()}...`} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={4}
          className="w-[var(--radix-select-trigger-width)]"
        >
          {options.length === 0 ? (
            <SelectItem value="__empty" disabled>
              {field.dependsOn ? 'Seleccione primero el campo dependiente' : 'Sin opciones'}
            </SelectItem>
          ) : (
            options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onFieldChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white p-3 text-sm"
      />
    )
  }

  return (
    <Input
      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => onFieldChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className="h-11 border-gray-300 bg-white"
    />
  )
}

function SchemaFields({
  schema,
  initialValues,
  onChange,
}: {
  schema: MetadataSchema
  initialValues?: Record<string, string>
  onChange?: (values: Record<string, string>) => void
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? {})

  useEffect(() => {
    onChange?.(values)
  }, [values, onChange])

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-5">
      <p className="text-sm font-medium text-[#00315C]">{schema.label}</p>
      {schema.fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <label className="text-sm font-medium text-[#00315C]">
            {field.label}
            {field.required ? <span className="ml-1 text-red-500">*</span> : null}
          </label>
          {renderField(field, values, handleFieldChange)}
        </div>
      ))}
    </div>
  )
}

export function MetadataFormDynamic({
  schemaKey,
  initialValues,
  onChange,
}: MetadataFormDynamicProps) {
  if (!schemaKey) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-[#F8FAFC] py-10 text-center">
        <div className="rounded-lg bg-gray-100 p-3">
          <FileText className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">
            Complete la clasificación del documento
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Los metadatos específicos aparecerán cuando seleccione tema, tipo documental y carpeta
            final.
          </p>
        </div>
      </div>
    )
  }

  const schema = METADATA_SCHEMAS[schemaKey]
  if (!schema) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#F6C07B] bg-[#FFF9EE] py-10 text-center">
        <div className="rounded-lg bg-[#FFF4E5] p-3">
          <Info className="h-6 w-6 text-[#D97706]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-[#A8610A]">
          Aún no hay un formulario de metadatos para esta combinación de clasificación.
        </p>
      </div>
    )
  }

  return (
    <SchemaFields
      key={schema.key}
      schema={schema}
      initialValues={initialValues}
      onChange={onChange}
    />
  )
}
