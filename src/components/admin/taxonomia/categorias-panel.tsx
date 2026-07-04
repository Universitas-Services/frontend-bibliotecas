'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { BookOpen, PlusCircle, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  aprobarCategoriaAction,
  createCategoriaAction,
  rechazarCategoriaAction,
} from '@/app/actions/categorias'
import { PendientesTable } from '@/components/admin/taxonomia/pendientes-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getEstadoAprobacionLabel } from '@/lib/taxonomia-normalize'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'
import type { CategoriaItem, SugerenciaPendiente } from '@/lib/types/taxonomia'

type CategoriasPanelProps = {
  categorias?: CategoriaItem[]
  pendientes?: SugerenciaPendiente[]
}

export function CategoriasPanel({ categorias = [], pendientes = [] }: CategoriasPanelProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [, startTransition] = useTransition()
  const [state, formAction, isPending] = useActionState(createCategoriaAction, null)

  const inventarioFiltrado = categorias.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (state?.success) {
      toastSuccess(USER_MSG.success.categoriaCreated)
      startTransition(() => router.refresh())
    } else if (state?.error) {
      toastError('No pudimos crear la categoría', state.error)
    }
  }, [state, router, startTransition])

  const refreshPage = () => startTransition(() => router.refresh())

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-8">
      <div className="space-y-2 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#00315C]">
          Gestión de categorías: Ramas del derecho
        </h1>
        <p className="text-lg text-gray-500">
          Creación y moderación de la taxonomía legal de alto nivel
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
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

        <div className="space-y-8 lg:col-span-8">
          <PendientesTable
            title="Bandeja de sugerencias de categorías"
            itemLabel="Categoría sugerida"
            pendientes={pendientes}
            onApprove={aprobarCategoriaAction}
            onReject={rechazarCategoriaAction}
            onResolved={refreshPage}
          />

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
                    <th className="px-6 py-4 whitespace-nowrap">ID</th>
                    <th className="px-6 py-4 whitespace-nowrap">Nombre</th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventarioFiltrado.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        No hay categorías disponibles.
                      </td>
                    </tr>
                  ) : (
                    inventarioFiltrado.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-gray-500">{item.id}</td>
                        <td className="px-6 py-4">
                          <div className="text-base font-bold text-[#00315C]">{item.nombre}</div>
                          {item.descripcion ? (
                            <div className="text-xs text-gray-500">{item.descripcion}</div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              item.estado === 'APROBADA' || !item.estado
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : item.estado === 'SUGERIDA'
                                  ? 'border-orange-200 bg-orange-50 text-orange-700'
                                  : 'border-red-200 bg-red-50 text-red-700'
                            }
                          >
                            {getEstadoAprobacionLabel(item.estado ?? 'APROBADA')}
                          </Badge>
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
