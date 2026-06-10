'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { getCategoriasAdmin } from '@/app/actions/categorias'

interface CategoriaItem {
  id?: string
  _id?: string
  nombre: string
}

type InitialCategoria = string | { id?: string; _id?: string; nombre?: string }

interface TaxonomySectionProps {
  initialCategorias?: InitialCategoria[]
}

function getInitialCategoriaIds(initialCategorias: InitialCategoria[]): string[] {
  return initialCategorias
    .map((categoria) => (typeof categoria === 'string' ? categoria : categoria.id || categoria._id))
    .filter((id): id is string => Boolean(id))
}

export function TaxonomySection({ initialCategorias }: TaxonomySectionProps = {}) {
  const [categoriasDB, setCategoriasDB] = useState<CategoriaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategorias, setSelectedCategorias] = useState<CategoriaItem[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const catData = await getCategoriasAdmin()
        const categorias = Array.isArray(catData) ? catData : []
        setCategoriasDB(categorias)

        if (initialCategorias && initialCategorias.length > 0) {
          const initialIds = getInitialCategoriaIds(initialCategorias)
          const matchedCats = categorias.filter((cat) =>
            initialIds.includes(cat.id || cat._id || ''),
          )
          if (matchedCats.length > 0) {
            setSelectedCategorias(matchedCats)
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectCategoria = (cat: CategoriaItem) => {
    if (!selectedCategorias.some((c) => c.id === cat.id || c._id === cat._id)) {
      setSelectedCategorias([...selectedCategorias, cat])
    }
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleRemoveCategoria = (catId?: string) => {
    if (!catId) return
    setSelectedCategorias(selectedCategorias.filter((c) => (c.id || c._id) !== catId))
  }

  const filteredCategorias = categoriasDB.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Inputs ocultos para que el form capture los IDs seleccionados */}
      {selectedCategorias.map((cat) => (
        <input
          key={cat.id || cat._id}
          type="hidden"
          name="categoriaIds"
          value={cat.id || cat._id}
        />
      ))}

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Categorías asignadas</label>
        <div
          ref={containerRef}
          className="relative flex min-h-[52px] flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2"
        >
          {selectedCategorias.map((cat) => (
            <Badge
              key={`badge-${cat.id || cat._id}`}
              className="flex items-center gap-1.5 rounded-full bg-[#00315C] px-3 py-1 font-normal text-white hover:bg-[#00315C]/90"
            >
              {cat.nombre}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveCategoria(cat.id || cat._id)}
              />
            </Badge>
          ))}

          <div className="relative min-w-[150px] flex-1">
            {loading ? (
              <div className="flex items-center pl-2 text-xs text-gray-400">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Cargando...
              </div>
            ) : (
              <input
                type="text"
                placeholder={selectedCategorias.length === 0 ? 'Añadir categoría...' : ''}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border-none bg-transparent px-2 text-sm text-gray-600 outline-none focus:ring-0"
              />
            )}

            {/* Menú desplegable */}
            {showDropdown && filteredCategorias.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                {filteredCategorias.map((cat) => (
                  <div
                    key={cat.id || cat._id}
                    onClick={() => handleSelectCategoria(cat)}
                    className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {cat.nombre}
                  </div>
                ))}
              </div>
            )}
            {showDropdown && filteredCategorias.length === 0 && !loading && (
              <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-lg">
                No se encontraron categorías.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
