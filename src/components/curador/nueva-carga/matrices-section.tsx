'use client'

import { useEffect, useState } from 'react'
import { Link as LinkIcon, Loader2 } from 'lucide-react'
import { listMatrizAAction, listMatrizBAction } from '@/app/actions/matrices'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type MatricesSectionProps = {
  initialMatrizAId?: string
  initialMatrizBIds?: string[]
}

function getMatrizId(mat: Record<string, string | number>): string {
  return String(mat.id || mat._id || '')
}

export function MatricesSection({
  initialMatrizAId,
  initialMatrizBIds = [],
}: MatricesSectionProps = {}) {
  const [matricesA, setMatricesA] = useState<Record<string, string | number>[]>([])
  const [matricesB, setMatricesB] = useState<Record<string, string | number>[]>([])
  const [loadingA, setLoadingA] = useState(true)
  const [loadingB, setLoadingB] = useState(true)
  const [selectedMatrizAId, setSelectedMatrizAId] = useState(initialMatrizAId || '')
  const [selectedMatrizBIds, setSelectedMatrizBIds] = useState<string[]>(initialMatrizBIds)

  useEffect(() => {
    async function fetchData() {
      try {
        const resA = await listMatrizAAction()
        if (resA.success) setMatricesA(resA.data)
      } finally {
        setLoadingA(false)
      }

      try {
        const resB = await listMatrizBAction()
        if (resB.success) setMatricesB(resB.data)
      } finally {
        setLoadingB(false)
      }
    }
    fetchData()
  }, [])

  const toggleMatrizB = (id: string, checked: boolean) => {
    setSelectedMatrizBIds((current) => {
      if (checked) {
        return current.includes(id) ? current : [...current, id]
      }
      return current.filter((item) => item !== id)
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Seleccione las matrices que considere adecuadas (opcional). Un revisor o administrador las
        validará al publicar el documento.
      </p>

      <input type="hidden" name="matrizBIds" value={selectedMatrizBIds.join(',')} />

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-[#F8FAFC] p-3 text-center text-sm font-medium text-[#005496]">
            Matriz A — Formación (una opción)
          </div>
          <div className="flex-1 space-y-4 p-4">
            <div className="relative">
              {loadingA ? (
                <div className="flex h-11 items-center justify-center rounded-md border bg-gray-50 text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando catálogo...
                </div>
              ) : (
                <select
                  name="matrizAId"
                  value={selectedMatrizAId}
                  onChange={(event) => setSelectedMatrizAId(event.target.value)}
                  className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]"
                >
                  <option value="">Selecciona un producto de formación...</option>
                  {matricesA.map((mat) => {
                    const id = getMatrizId(mat)
                    return (
                      <option key={id} value={id}>
                        {mat.nombreProducto || mat.nombre || 'Producto sin nombre'}
                      </option>
                    )
                  })}
                </select>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-[#F1F5F9] p-3">
              <div className="shrink-0 rounded bg-[#D4E4FA] p-2 text-[#005496]">
                <LinkIcon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs leading-tight font-semibold text-gray-900">
                  Vinculación a formación
                </p>
                <p className="mt-1 text-[10px] text-gray-500">
                  Producto de la matriz A sugerido para este documento
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-[#F8FAFC] p-3 text-center text-sm font-medium text-[#005496]">
            Matriz B — Ágora (múltiples opciones)
          </div>
          <div className="flex-1 space-y-4 p-4">
            <div className="relative">
              {loadingB ? (
                <div className="flex h-32 items-center justify-center rounded-md border bg-gray-50 text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando repositorio...
                </div>
              ) : matricesB.length === 0 ? (
                <p className="rounded-md border border-dashed p-4 text-center text-sm text-gray-500">
                  No hay artículos disponibles en el catálogo.
                </p>
              ) : (
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-gray-200 p-3">
                  {matricesB.map((mat) => {
                    const id = getMatrizId(mat)
                    const checked = selectedMatrizBIds.includes(id)
                    return (
                      <div
                        key={id}
                        className="flex items-start gap-3 rounded-md p-1 hover:bg-slate-50"
                      >
                        <Checkbox
                          id={`matriz-b-${id}`}
                          checked={checked}
                          onCheckedChange={(value) => toggleMatrizB(id, value === true)}
                        />
                        <Label
                          htmlFor={`matriz-b-${id}`}
                          className="cursor-pointer text-sm leading-snug text-[#00315C]"
                        >
                          {mat.tituloArticulo || mat.titulo || 'Artículo sin título'}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedMatrizBIds.length > 0 ? (
              <p className="text-xs text-slate-500">
                {selectedMatrizBIds.length} artículo{selectedMatrizBIds.length === 1 ? '' : 's'}{' '}
                seleccionado{selectedMatrizBIds.length === 1 ? '' : 's'}
              </p>
            ) : null}

            <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-[#F1F5F9] p-3">
              <div className="shrink-0 rounded bg-[#D4E4FA] p-2 text-[#005496]">
                <LinkIcon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs leading-tight font-semibold text-gray-900">
                  Vinculación editorial
                </p>
                <p className="mt-1 text-[10px] text-gray-500">
                  Artículos de Ágora relacionados con esta carga
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
