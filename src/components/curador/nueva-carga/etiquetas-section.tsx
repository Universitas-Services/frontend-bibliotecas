'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Loader2, Tag, X } from 'lucide-react'

import { getEtiquetasAprobadasAction } from '@/app/actions/etiquetas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CharacterCounter } from '@/components/ui/character-counter'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { ETIQUETAS_LIMITS } from '@/lib/seo-limits'
import { toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'
import type { EtiquetaItem } from '@/lib/types/taxonomia'

type EtiquetasSectionProps = {
  initialEtiquetas?: string[]
}

function normalizeTagName(value: string): string {
  return value.trim().replace(/^#+/, '').slice(0, ETIQUETAS_LIMITS.etiquetaMaxLength)
}

function tagsMatch(a: string, b: string): boolean {
  return normalizeTagName(a).toLowerCase() === normalizeTagName(b).toLowerCase()
}

export function EtiquetasSection({ initialEtiquetas = [] }: EtiquetasSectionProps) {
  const [etiquetasDB, setEtiquetasDB] = useState<EtiquetaItem[]>([])
  const [selectedEtiquetas, setSelectedEtiquetas] = useState<string[]>(
    initialEtiquetas.map(normalizeTagName).filter(Boolean),
  )
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEtiquetasAprobadasAction()
        setEtiquetasDB(data)
      } catch (error) {
        console.error('Error al cargar etiquetas', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const addEtiqueta = (nombre: string, isSuggestion = false) => {
    const trimmed = normalizeTagName(nombre)
    if (!trimmed) return
    if (selectedEtiquetas.length >= ETIQUETAS_LIMITS.maxEtiquetas) return
    if (selectedEtiquetas.some((item) => tagsMatch(item, trimmed))) {
      setSearchTerm('')
      return
    }

    setSelectedEtiquetas((prev) => [...prev, trimmed])
    setSearchTerm('')
    inputRef.current?.focus()

    if (isSuggestion) {
      toastSuccess(USER_MSG.success.etiquetaSuggested)
    }
  }

  const handleRemoveEtiqueta = (nombre: string) => {
    setSelectedEtiquetas((prev) => prev.filter((item) => !tagsMatch(item, nombre)))
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredEtiquetas = etiquetasDB.filter(
    (item) =>
      item.nombre.toLowerCase().includes(normalizedSearch) &&
      !selectedEtiquetas.some((selected) => tagsMatch(selected, item.nombre)),
  )

  const hasExactMatch =
    normalizedSearch.length > 0 &&
    etiquetasDB.some((item) => item.nombre.toLowerCase() === normalizedSearch)

  const canSuggest =
    normalizedSearch.length > 0 &&
    !hasExactMatch &&
    !selectedEtiquetas.some((item) => item.toLowerCase() === normalizedSearch)

  const atLimit = selectedEtiquetas.length >= ETIQUETAS_LIMITS.maxEtiquetas

  return (
    <div className="space-y-6">
      <input type="hidden" name="etiquetas" value={JSON.stringify(selectedEtiquetas)} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#00315C]">Etiquetas</label>
          <CharacterCounter
            current={selectedEtiquetas.length}
            max={ETIQUETAS_LIMITS.maxEtiquetas}
          />
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <Popover open={showDropdown} onOpenChange={setShowDropdown} modal={false}>
              <PopoverAnchor asChild>
                <div
                  role="combobox"
                  aria-expanded={showDropdown}
                  className="relative flex min-h-[52px] cursor-text flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2"
                  onClick={() => {
                    if (!loading && !atLimit) {
                      setShowDropdown(true)
                      inputRef.current?.focus()
                    }
                  }}
                >
                  {selectedEtiquetas.map((nombre) => (
                    <Badge
                      key={nombre}
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-full border-[#93C5FD] bg-[#EFF6FF] px-3 py-1 font-normal text-[#1D4ED8] hover:bg-[#DBEAFE]"
                    >
                      #{nombre}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleRemoveEtiqueta(nombre)
                        }}
                        className="rounded-full hover:text-red-600"
                        aria-label={`Quitar ${nombre}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  <div className="flex min-w-[150px] flex-1 items-center gap-1">
                    {loading ? (
                      <div className="flex items-center pl-2 text-xs text-gray-400">
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Cargando...
                      </div>
                    ) : atLimit ? (
                      <span className="pl-2 text-xs text-gray-400">Límite alcanzado</span>
                    ) : (
                      <>
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder={
                            selectedEtiquetas.length === 0
                              ? 'Buscar y seleccionar etiqueta...'
                              : 'Añadir etiqueta...'
                          }
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(
                              e.target.value.slice(0, ETIQUETAS_LIMITS.etiquetaMaxLength),
                            )
                            setShowDropdown(true)
                          }}
                          onFocus={() => setShowDropdown(true)}
                          className="w-full border-none bg-transparent px-2 text-sm text-gray-600 outline-none focus:ring-0"
                        />
                        <ChevronDown className="mr-1 h-4 w-4 shrink-0 text-gray-400" />
                      </>
                    )}
                  </div>
                </div>
              </PopoverAnchor>

              <PopoverContent
                align="start"
                sideOffset={4}
                className="max-h-60 w-[var(--radix-popover-anchor-width)] overflow-y-auto p-0"
                onOpenAutoFocus={(event) => event.preventDefault()}
              >
                {filteredEtiquetas.length > 0 ? (
                  filteredEtiquetas.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() => addEtiqueta(item.nombre)}
                      className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      #{item.nombre}
                    </button>
                  ))
                ) : canSuggest ? (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No hay coincidencias. Use el botón «Sugerir» para proponer una nueva etiqueta.
                  </p>
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    {loading ? 'Cargando etiquetas...' : 'No se encontraron etiquetas.'}
                  </p>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={!canSuggest || atLimit}
            onClick={() => addEtiqueta(searchTerm, true)}
            className="h-[52px] shrink-0 gap-2 border-gray-300 bg-gray-50 px-4 text-gray-700 hover:bg-gray-100"
          >
            <Tag className="h-4 w-4" />
            Sugerir
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Seleccione etiquetas aprobadas del listado o proponga una nueva con «Sugerir»; las nuevas
          quedarán pendientes de moderación.
        </p>
      </div>
    </div>
  )
}
