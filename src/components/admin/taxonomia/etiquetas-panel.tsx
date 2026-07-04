'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { LibrarySquare, Loader2, PlusCircle, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  aprobarEtiquetaAction,
  createEtiquetaAction,
  deleteEtiquetaAction,
  rechazarEtiquetaAction,
} from '@/app/actions/etiquetas'
import { PendientesTable } from '@/components/admin/taxonomia/pendientes-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getEstadoAprobacionLabel } from '@/lib/taxonomia-normalize'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'
import type { EtiquetaItem, SugerenciaPendiente } from '@/lib/types/taxonomia'

type EtiquetasPanelProps = {
  etiquetas: EtiquetaItem[]
  pendientes: SugerenciaPendiente[]
}

export function EtiquetasPanel({ etiquetas, pendientes }: EtiquetasPanelProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [state, formAction, isPending] = useActionState(createEtiquetaAction, null)

  const inventarioFiltrado = etiquetas.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (state?.success) {
      toastSuccess(USER_MSG.success.etiquetaCreated)
      startTransition(() => router.refresh())
    } else if (state && 'error' in state && state.error) {
      toastError(USER_MSG.error.createEtiqueta, state.error)
    }
  }, [state, router, startTransition])

  const handleDelete = async (id: string, nombre: string) => {
    const confirmed = window.confirm(`¿Eliminar permanentemente la etiqueta «${nombre}»?`)
    if (!confirmed) return

    setDeletingId(id)
    try {
      const result = await deleteEtiquetaAction(id)
      if (result.success) {
        toastSuccess(USER_MSG.success.etiquetaDeleted)
        startTransition(() => router.refresh())
      } else {
        toastError(USER_MSG.error.deleteEtiqueta, result.error)
      }
    } finally {
      setDeletingId(null)
    }
  }

  const refreshPage = () => startTransition(() => router.refresh())

  return (
    <div className="flex h-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#00315C]">
          Gestión de etiquetas y motor semántico
        </h1>
        <p className="text-lg text-gray-500">
          Administración de la taxonomía semántica y moderación de sugerencias.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <PendientesTable
            title="Bandeja de resolución de sugerencias"
            itemLabel="Etiqueta sugerida"
            pendientes={pendientes}
            onApprove={aprobarEtiquetaAction}
            onReject={rechazarEtiquetaAction}
            onResolved={refreshPage}
          />

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#00315C]">
              <PlusCircle className="h-5 w-5 text-[#00315C]" />
              Crear nueva etiqueta
            </h2>

            <form action={formAction} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                  Nombre de la etiqueta
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  required
                  placeholder="Ej. Derecho Administrativo"
                  className="h-10 bg-[#F8FAFC]"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#00315C] text-white hover:bg-[#002240]"
              >
                {isPending ? 'Creando...' : 'Crear nueva'}
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-4">
          <div className="rounded-xl border bg-[#F5F8FA] p-6 text-sm text-[#00315C]">
            <p className="font-semibold">Nota</p>
            <p className="mt-2 leading-relaxed text-gray-600">
              Las etiquetas sugeridas por curadores al cargar documentos aparecen en la bandeja de
              pendientes. La fusión de etiquetas duplicadas estará disponible en una fase posterior.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#00315C]">
            <LibrarySquare className="h-6 w-6" />
            Listado de etiquetas existentes
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Filtrar etiquetas..."
              className="bg-white pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC]">
                <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                <TableHead className="text-center font-semibold text-gray-600">Estado</TableHead>
                <TableHead className="text-center font-semibold text-gray-600">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventarioFiltrado.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-gray-500">
                    No hay etiquetas disponibles.
                  </TableCell>
                </TableRow>
              ) : (
                inventarioFiltrado.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">{item.nombre}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          item.estado === 'APROBADA'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : item.estado === 'SUGERIDA'
                              ? 'border-orange-200 bg-orange-50 text-orange-700'
                              : 'border-red-200 bg-red-50 text-red-700'
                        }
                      >
                        {getEstadoAprobacionLabel(item.estado)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        disabled={deletingId === item.id}
                        onClick={() => handleDelete(item.id, item.nombre)}
                        className="text-red-500 transition-colors hover:text-red-600 disabled:opacity-50"
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="mx-auto h-5 w-5" strokeWidth={1.5} />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
