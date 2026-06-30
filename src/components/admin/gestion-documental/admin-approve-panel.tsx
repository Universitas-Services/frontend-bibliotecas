'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, RotateCcw, XCircle } from 'lucide-react'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'

import { aprobarDocumentoAction, rechazarDocumentoAction } from '@/app/actions/admin-documents'
import { listMatrizAAction, listMatrizBAction } from '@/app/actions/matrices'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { DocumentMatrices } from '@/lib/document-matrices'
import type { DocumentStatus } from '@/lib/document-status'

type AdminApprovePanelProps = {
  documentoId: string
  status: DocumentStatus
  curatorMatrices: DocumentMatrices
}

function getMatrizId(mat: Record<string, string | number>): string {
  return String(mat.id || mat._id || '')
}

export function AdminApprovePanel({
  documentoId,
  status,
  curatorMatrices,
}: AdminApprovePanelProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [motivo, setMotivo] = useState('')
  const [overrideMatrices, setOverrideMatrices] = useState(false)
  const [matricesA, setMatricesA] = useState<Record<string, string | number>[]>([])
  const [matricesB, setMatricesB] = useState<Record<string, string | number>[]>([])
  const [loadingMatrices, setLoadingMatrices] = useState(false)
  const [selectedMatrizAId, setSelectedMatrizAId] = useState(curatorMatrices.matrizAId || '')
  const [selectedMatrizBIds, setSelectedMatrizBIds] = useState<string[]>(curatorMatrices.matrizBIds)

  useEffect(() => {
    if (!overrideMatrices) return

    let cancelled = false

    async function loadCatalogs() {
      setLoadingMatrices(true)
      try {
        const [resA, resB] = await Promise.all([listMatrizAAction(), listMatrizBAction()])
        if (cancelled) return
        if (resA.success) setMatricesA(resA.data)
        if (resB.success) setMatricesB(resB.data)
      } finally {
        if (!cancelled) setLoadingMatrices(false)
      }
    }

    loadCatalogs()
    return () => {
      cancelled = true
    }
  }, [overrideMatrices])

  if (status === 'publicado') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Este documento ya está publicado.
      </div>
    )
  }

  if (status === 'borrador') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        El documento aún es un borrador del curador. Debe enviarlo a revisión antes de poder
        aprobarlo o rechazarlo.
      </div>
    )
  }

  const toggleMatrizB = (id: string, checked: boolean) => {
    setSelectedMatrizBIds((current) => {
      if (checked) {
        return current.includes(id) ? current : [...current, id]
      }
      return current.filter((item) => item !== id)
    })
  }

  const handleApprove = () => {
    startTransition(async () => {
      const result = await aprobarDocumentoAction(documentoId, {
        overrideMatrices,
        matrizAId: overrideMatrices ? selectedMatrizAId || null : undefined,
        matrizBIds: overrideMatrices ? selectedMatrizBIds : undefined,
      })

      if (!result.success) {
        toastError(
          USER_MSG.error.approveDocument,
          [result.error, result.details].filter(Boolean).join('\n'),
        )
        return
      }

      toastSuccess(USER_MSG.success.documentApproved)
      router.refresh()
    })
  }

  const handleReject = () => {
    if (!motivo.trim()) {
      toastError(USER_MSG.validation.rejectionReason)
      return
    }

    startTransition(async () => {
      const result = await rechazarDocumentoAction(documentoId, { motivo })

      if (!result.success) {
        toastError(
          USER_MSG.error.rejectDocument,
          [result.error, result.details].filter(Boolean).join('\n'),
        )
        return
      }

      toastSuccess(USER_MSG.success.documentRejected)
      router.push('/admin/gestion-documental')
    })
  }

  const handleClearOverride = () => {
    setSelectedMatrizAId('')
    setSelectedMatrizBIds([])
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border border-[#C1C7D2] bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#0F1D30]">Matrices propuestas por el curador</h3>
          <p className="mt-1 text-sm text-[#6B7280]">
            Si publica sin modificar, se conservarán estas asignaciones.
          </p>
        </div>

        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <div>
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Matriz A</p>
            <p className="mt-1 font-medium text-[#00315C]">
              {curatorMatrices.matrizA?.nombre || 'Sin asignar'}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Matriz B</p>
            {curatorMatrices.matrizB.length > 0 ? (
              <ul className="mt-1 list-disc space-y-1 pl-4 text-[#00315C]">
                {curatorMatrices.matrizB.map((item) => (
                  <li key={item.id}>{item.titulo}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 font-medium text-[#00315C]">Sin asignar</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-md border border-slate-200 p-3">
          <Checkbox
            id="override-matrices"
            checked={overrideMatrices}
            onCheckedChange={(value) => setOverrideMatrices(value === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="override-matrices" className="text-sm font-semibold text-[#0F1D30]">
              Modificar matrices al publicar
            </Label>
            <p className="text-xs text-[#6B7280]">
              Active esta opción para sobrescribir la propuesta del curador. Para quitar todas las
              matrices, active la opción y deje los campos vacíos.
            </p>
          </div>
        </div>

        {overrideMatrices ? (
          <div className="space-y-4 rounded-md border border-dashed border-slate-300 p-3">
            {loadingMatrices ? (
              <div className="flex items-center justify-center py-6 text-sm text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando catálogos...
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F1D30]">Matriz A</label>
                  <select
                    value={selectedMatrizAId}
                    onChange={(event) => setSelectedMatrizAId(event.target.value)}
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]"
                  >
                    <option value="">Sin matriz A</option>
                    {matricesA.map((mat) => {
                      const id = getMatrizId(mat)
                      return (
                        <option key={id} value={id}>
                          {mat.nombreProducto || mat.nombre || 'Producto sin nombre'}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0F1D30]">Matriz B</label>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-gray-200 p-3">
                    {matricesB.length === 0 ? (
                      <p className="text-sm text-slate-500">No hay artículos en el catálogo.</p>
                    ) : (
                      matricesB.map((mat) => {
                        const id = getMatrizId(mat)
                        const checked = selectedMatrizBIds.includes(id)
                        return (
                          <div key={id} className="flex items-start gap-3">
                            <Checkbox
                              id={`admin-matriz-b-${id}`}
                              checked={checked}
                              onCheckedChange={(value) => toggleMatrizB(id, value === true)}
                            />
                            <Label
                              htmlFor={`admin-matriz-b-${id}`}
                              className="cursor-pointer text-sm text-[#00315C]"
                            >
                              {mat.tituloArticulo || mat.titulo || 'Artículo sin título'}
                            </Label>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearOverride}
                  className="text-xs"
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  Vaciar matrices
                </Button>
              </>
            )}
          </div>
        ) : null}

        <Button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="w-full bg-[#16A34A] hover:bg-[#15803D] sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aprobando...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Aprobar y publicar
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50/40 p-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#991B1B]">Devolver al curador</h3>
          <p className="mt-1 text-sm text-[#7F1D1D]">
            El documento volverá a borrador y se creará una nota interna con el motivo indicado.
          </p>
        </div>

        <Textarea
          value={motivo}
          onChange={(event) => setMotivo(event.target.value)}
          placeholder="Ej: El PDF no corresponde al título y faltan etiquetas clave."
          className="min-h-[100px] resize-none bg-white"
        />

        <Button
          type="button"
          variant="destructive"
          onClick={handleReject}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Devolviendo...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Rechazar y devolver
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
