'use client'

import { useActionState, useEffect, useState } from 'react'
import { BookOpen, Edit, PlusCircle, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { createCategoriaAction } from '@/app/actions/categorias'
import { FeatureUnavailableBanner } from '@/components/admin/feature-unavailable-banner'

interface CategoriaProp {
  id?: string | number
  _id?: string | number
  nombre?: string
  descripcion?: string
  sugerenciasCount?: number | string
  activo?: boolean
}

export function CategoriasPanel({ categorias = [] }: { categorias?: CategoriaProp[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [state, formAction, isPending] = useActionState(createCategoriaAction, null)

  // Asumimos que el backend devuelve un arreglo de categorías con id y nombre
  const inventario = categorias.map((cat, index) => ({
    id: cat.id || cat._id || index + 1,
    idCategoria: cat.id || cat._id || `CAT-00${index + 1}`,
    nombre: cat.nombre || 'Sin nombre',
    descripcion: cat.descripcion || '-',
    etiquetaAsociada: cat.nombre || '-',
    publicaciones: cat.sugerenciasCount || '0',
    activo: cat.activo !== undefined ? cat.activo : true,
  }))

  // Filtrado de inventario
  const inventarioFiltrado = inventario.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (state?.success) {
      toast.success('Categoría creada exitosamente.')
      // Opcional: limpiar el input
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="space-y-2 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#00315C]">
          Gestión de categorías: Ramas del derecho
        </h1>
        <p className="text-lg text-gray-500">
          Creación, edición y auditoría de la taxonomía legal de alto nivel
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna Izquierda: Crear Categoría */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-bold text-[#00315C]">Crear nueva categoría</h2>
            </div>

            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-xs font-semibold text-gray-600">
                  Nombre de la categoría
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  required
                  placeholder="Ejemplo: Derecho Laboral"
                  className="border-gray-200 bg-gray-100/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-xs font-semibold text-gray-600">
                  Descripción de la categoría
                </Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Defina el alcance jurídico de esta rama..."
                  className="min-h-[120px] resize-none border-gray-200 bg-gray-100/60"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="h-10 w-full rounded-lg bg-[#00315C] font-medium hover:bg-[#002244]"
              >
                {isPending ? (
                  'Creando...'
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear nueva categoría
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="rounded-lg border-l-4 border-[#00315C] bg-[#F5F8FA] p-4 text-sm text-[#00315C]">
            <span className="font-semibold">Nota:</span> Las categorías maestras actúan como el nodo
            raíz para toda la legislación vinculada en Universitas.
          </div>
        </div>

        {/* Columna Derecha: Bandeja e Inventario */}
        <div className="space-y-8 lg:col-span-8">
          <FeatureUnavailableBanner
            title="Bandeja de sugerencias de categorías no disponible"
            description="La aprobación y rechazo de categorías propuestas por curadores requiere endpoints del backend que aún no están conectados. Por ahora puede crear categorías maestras desde el formulario de la izquierda."
          />

          {/* Inventario de categorías maestras */}
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-gray-700" />
                <h2 className="text-lg font-bold text-[#00315C]">
                  Inventario de categorías maestras
                </h2>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Filtrar ramas..."
                  className="bg-white pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-white text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">ID Categoría</th>
                    <th className="px-6 py-4 whitespace-nowrap">Nombre</th>
                    <th className="px-6 py-4 whitespace-nowrap">Etiqueta asociada</th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">
                      Publicaciones vinculadas
                    </th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">Estado</th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventarioFiltrado.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No hay categorías disponibles.
                      </td>
                    </tr>
                  ) : (
                    inventarioFiltrado.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-gray-500">{item.idCategoria}</td>
                        <td className="px-6 py-4">
                          <div className="text-base font-bold text-[#00315C]">{item.nombre}</div>
                          <div className="text-xs text-gray-500">{item.descripcion}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{item.etiquetaAsociada}</td>
                        <td className="px-6 py-4 text-center font-medium text-gray-700">
                          {item.publicaciones}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Switch
                            checked={item.activo}
                            className="mx-auto block data-[state=checked]:bg-green-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button className="text-gray-600 transition-colors hover:text-[#00315C]">
                              <Edit className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                            <button className="text-red-500 transition-colors hover:text-red-600">
                              <Trash2 className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
