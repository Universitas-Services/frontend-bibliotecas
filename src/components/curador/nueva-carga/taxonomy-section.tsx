'use client'

import { useEffect, useState, useRef, useTransition } from 'react'
import { X, Loader2, ChevronDown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { getCategoriasAprobadasAction, sugerirCategoriaAction } from '@/app/actions/categorias'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'
import type { CategoriaItem } from '@/lib/types/taxonomia'

type InitialCategoria = string | { id?: string; _id?: string; nombre?: string }

interface TaxonomySectionProps {
  initialCategorias?: InitialCategoria[]
}

function getInitialCategoriaIds(initialCategorias: InitialCategoria[]): string[] {
  return initialCategorias
    .map((categoria) => {
      if (typeof categoria === 'string') return categoria.trim()
      return String(categoria.id || categoria._id || '').trim()
    })
    .filter(Boolean)
}

function getCategoriaId(cat: CategoriaItem): string {
  return String(cat.id || '').trim()
}

export function TaxonomySection({ initialCategorias }: TaxonomySectionProps = {}) {
  const [categoriasDB, setCategoriasDB] = useState<CategoriaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategorias, setSelectedCategorias] = useState<CategoriaItem[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSuggesting, startSuggestTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const catData = await getCategoriasAprobadasAction()
        setCategoriasDB(catData)

        if (initialCategorias && initialCategorias.length > 0) {
          const initialIds = getInitialCategoriaIds(initialCategorias)
          const matchedCats = catData.filter((cat) => initialIds.includes(getCategoriaId(cat)))

          if (matchedCats.length > 0) {
            setSelectedCategorias(matchedCats)
          } else if (initialIds.length > 0) {
            setSelectedCategorias(
              initialIds.map((id) => ({
                id,
                nombre: 'Categoría asignada',
              })),
            )
          }
        }
      } catch (error) {
        console.error('Error al cargar categorías', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectCategoria = (cat: CategoriaItem) => {
    const catId = getCategoriaId(cat)
    if (!catId) return
    if (!selectedCategorias.some((c) => getCategoriaId(c) === catId)) {
      setSelectedCategorias([...selectedCategorias, cat])
    }
    setSearchTerm('')
    inputRef.current?.focus()
  }

  const handleRemoveCategoria = (catId?: string) => {
    if (!catId) return
    setSelectedCategorias(selectedCategorias.filter((c) => getCategoriaId(c) !== catId))
  }

  const handleSuggestCategoria = () => {
    const trimmed = searchTerm.trim()
    if (!trimmed) return

    startSuggestTransition(async () => {
      const result = await sugerirCategoriaAction(trimmed)
      if (result.success) {
        toastSuccess(USER_MSG.success.categoriaSuggested)
        setSearchTerm('')
        setShowDropdown(false)
      } else {
        toastError(USER_MSG.error.suggestCategoria, result.error)
      }
    })
  }

  const selectedIds = new Set(selectedCategorias.map(getCategoriaId))
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredCategorias = categoriasDB.filter(
    (cat) =>
      cat.nombre.toLowerCase().includes(normalizedSearch) && !selectedIds.has(getCategoriaId(cat)),
  )

  const hasExactMatch =
    normalizedSearch.length > 0 &&
    categoriasDB.some((cat) => cat.nombre.toLowerCase() === normalizedSearch)

  const canSuggest = normalizedSearch.length > 0 && !hasExactMatch

  return (
    <div className="space-y-6">
      {selectedCategorias.map((cat) => (
        <input
          key={getCategoriaId(cat)}
          type="hidden"
          name="categoriaIds"
          value={getCategoriaId(cat)}
        />
      ))}

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Categorías asignadas</label>
        <Popover open={showDropdown} onOpenChange={setShowDropdown} modal={false}>
          <PopoverAnchor asChild>
            <div
              role="combobox"
              aria-expanded={showDropdown}
              className="relative flex min-h-[52px] cursor-text flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2"
              onClick={() => {
                if (!loading) {
                  setShowDropdown(true)
                  inputRef.current?.focus()
                }
              }}
            >
              {selectedCategorias.map((cat) => (
                <Badge
                  key={`badge-${getCategoriaId(cat)}`}
                  className="flex items-center gap-1.5 rounded-full bg-[#00315C] px-3 py-1 font-normal text-white hover:bg-[#00315C]/90"
                >
                  {cat.nombre}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemoveCategoria(getCategoriaId(cat))
                    }}
                    className="rounded-full hover:text-red-200"
                    aria-label={`Quitar ${cat.nombre}`}
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
                ) : (
                  <>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={
                        selectedCategorias.length === 0 ? 'Buscar y seleccionar categoría...' : ''
                      }
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
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
            {filteredCategorias.length > 0 ? (
              filteredCategorias.map((cat) => (
                <button
                  key={getCategoriaId(cat)}
                  type="button"
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => handleSelectCategoria(cat)}
                  className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {cat.nombre}
                </button>
              ))
            ) : canSuggest ? (
              <div className="space-y-2 p-3">
                <p className="text-sm text-gray-500">No se encontraron categorías aprobadas.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSuggesting}
                  onClick={handleSuggestCategoria}
                  className="w-full"
                >
                  {isSuggesting ? 'Enviando...' : `Sugerir «${searchTerm.trim()}»`}
                </Button>
              </div>
            ) : (
              <p className="px-4 py-3 text-sm text-gray-500">
                {loading ? 'Cargando categorías...' : 'No se encontraron categorías.'}
              </p>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
