'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'

import {
  getEstadosAction,
  getMunicipiosByEstadoAction,
  getParroquiasByMunicipioAction,
  getTribunalesEstadalesAction,
  getTribunalesMunicipalesAction,
} from '@/app/actions/global-territorio'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { MetadataFieldDefinition } from '@/lib/metadata-schemas'

type TerritorialOption = { id: number; nombre: string; label?: string }

type TerritorialSelectFieldProps = {
  field: MetadataFieldDefinition
  values: Record<string, string>
  onFieldChange: (updates: Record<string, string>) => void
}

const optionsCache = new Map<string, TerritorialOption[]>()

function cacheKey(source: string, parentId?: number): string {
  return parentId ? `${source}:${parentId}` : source
}

function resolveParentId(
  field: MetadataFieldDefinition,
  values: { estadoId?: string; municipioId?: string },
): number | null {
  if (!field.dependsOnId) return null
  const raw = values[field.dependsOnId as keyof typeof values]?.trim()
  if (!raw) return null
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? id : null
}

function resolveTribunalParentId(values: {
  estadoId?: string
  municipioId?: string
}): { type: 'municipal' | 'estatal'; id: number } | null {
  const municipioRaw = values.municipioId?.trim()
  if (municipioRaw) {
    const id = Number(municipioRaw)
    if (Number.isFinite(id) && id > 0) return { type: 'municipal', id }
  }

  const estadoRaw = values.estadoId?.trim()
  if (estadoRaw) {
    const id = Number(estadoRaw)
    if (Number.isFinite(id) && id > 0) return { type: 'estatal', id }
  }

  return null
}

async function loadOptions(
  field: MetadataFieldDefinition,
  context: { estadoId?: string; municipioId?: string },
): Promise<TerritorialOption[]> {
  const values = context
  const source = field.optionSource
  if (!source) return []

  if (source === 'global-estado') {
    const key = cacheKey(source)
    const cached = optionsCache.get(key)
    if (cached) return cached

    const result = await getEstadosAction()
    if (!result.success) throw new Error(result.error)

    const options = result.data.map((item) => ({ id: item.id, nombre: item.nombre }))
    optionsCache.set(key, options)
    return options
  }

  if (source === 'global-municipio') {
    const parentId = resolveParentId(field, values)
    if (!parentId) return []

    const key = cacheKey(source, parentId)
    const cached = optionsCache.get(key)
    if (cached) return cached

    const result = await getMunicipiosByEstadoAction(parentId)
    if (!result.success) throw new Error(result.error)

    const options = result.data.map((item) => ({ id: item.id, nombre: item.nombre }))
    optionsCache.set(key, options)
    return options
  }

  if (source === 'global-parroquia') {
    const parentId = resolveParentId(field, values)
    if (!parentId) return []

    const key = cacheKey(source, parentId)
    const cached = optionsCache.get(key)
    if (cached) return cached

    const result = await getParroquiasByMunicipioAction(parentId)
    if (!result.success) throw new Error(result.error)

    const options = result.data.map((item) => ({ id: item.id, nombre: item.nombre }))
    optionsCache.set(key, options)
    return options
  }

  if (source === 'global-tribunal') {
    const parent = resolveTribunalParentId(values)
    if (!parent) return []

    const key = cacheKey(`${source}:${parent.type}`, parent.id)
    const cached = optionsCache.get(key)
    if (cached) return cached

    const result =
      parent.type === 'municipal'
        ? await getTribunalesMunicipalesAction(parent.id)
        : await getTribunalesEstadalesAction(parent.id)

    if (!result.success) throw new Error(result.error)

    const options = result.data.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      label: item.categoria ? `${item.nombre} (${item.categoria})` : item.nombre,
    }))
    optionsCache.set(key, options)
    return options
  }

  return []
}

export function TerritorialSelectField({
  field,
  values,
  onFieldChange,
}: TerritorialSelectFieldProps) {
  const [options, setOptions] = useState<TerritorialOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadContext = useMemo(
    () => ({
      estadoId: values.estadoId,
      municipioId: values.municipioId,
    }),
    [values.estadoId, values.municipioId],
  )

  const tribunalParent =
    field.optionSource === 'global-tribunal' ? resolveTribunalParentId(loadContext) : null
  const parentId =
    field.optionSource === 'global-tribunal'
      ? tribunalParent?.id
      : resolveParentId(field, loadContext)

  const selectedName = values[field.key] ?? ''
  const selectedId = field.companionIdKey ? (values[field.companionIdKey] ?? '') : ''
  const legacyName = selectedName.trim()
  const legacyId = selectedId.trim()

  const needsParent =
    field.optionSource === 'global-municipio' ||
    field.optionSource === 'global-parroquia' ||
    field.optionSource === 'global-tribunal'

  const parentReady =
    field.optionSource === 'global-tribunal'
      ? tribunalParent !== null
      : !field.dependsOnId || Boolean(parentId)

  useEffect(() => {
    let cancelled = false

    async function fetchOptions() {
      if (needsParent && !parentReady) {
        setOptions([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const loaded = await loadOptions(field, loadContext)
        if (cancelled) return

        setOptions(loaded)

        const idKey = field.companionIdKey
        if (legacyName && idKey && !legacyId) {
          const match = loaded.find((option) => option.nombre === legacyName)
          if (match) {
            onFieldChange({ [idKey]: String(match.id) })
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar opciones.')
          setOptions([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchOptions()

    return () => {
      cancelled = true
    }
  }, [
    field.companionIdKey,
    field.dependsOnId,
    field.key,
    field.optionSource,
    legacyId,
    legacyName,
    loadContext,
    needsParent,
    onFieldChange,
    parentId,
    parentReady,
  ])

  const handleChange = useCallback(
    (idStr: string) => {
      const option = options.find((item) => String(item.id) === idStr)
      if (!option) return

      const updates: Record<string, string> = { [field.key]: option.nombre }
      if (field.companionIdKey) {
        updates[field.companionIdKey] = String(option.id)
      }
      onFieldChange(updates)
    },
    [field.companionIdKey, field.key, onFieldChange, options],
  )

  const placeholder = useMemo(() => {
    if (loading) return 'Cargando...'
    if (!parentReady && needsParent) {
      if (field.optionSource === 'global-tribunal') {
        return 'Seleccione primero estado o municipio...'
      }
      return 'Seleccione primero el campo dependiente'
    }
    return `Seleccione ${field.label.toLowerCase()}...`
  }, [field.label, field.optionSource, loading, needsParent, parentReady])

  return (
    <div className="space-y-1">
      <Select
        value={selectedId || undefined}
        onValueChange={handleChange}
        disabled={loading || (needsParent && !parentReady)}
      >
        <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
          {loading ? (
            <span className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando...
            </span>
          ) : (
            <SelectValue placeholder={placeholder}>{selectedName || undefined}</SelectValue>
          )}
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={4}
          className="w-[var(--radix-select-trigger-width)]"
        >
          {options.length === 0 ? (
            <SelectItem value="__empty" disabled>
              {error || (needsParent && !parentReady ? placeholder : 'Sin opciones')}
            </SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem key={option.id} value={String(option.id)}>
                {option.label ?? option.nombre}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
