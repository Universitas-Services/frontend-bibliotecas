'use client'

import { useEffect, useState } from 'react'
import { Link as LinkIcon, Loader2 } from 'lucide-react'
import { listMatrizAAction, listMatrizBAction } from '@/app/actions/matrices'

export function MatricesSection() {
  const [matricesA, setMatricesA] = useState<Record<string, string | number>[]>([])
  const [matricesB, setMatricesB] = useState<Record<string, string | number>[]>([])
  const [loadingA, setLoadingA] = useState(true)
  const [loadingB, setLoadingB] = useState(true)

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

  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
      {/* Matriz A */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-[#F8FAFC] p-3 text-center text-sm font-medium text-[#005496]">
          Matriz A — Formación
        </div>
        <div className="flex-1 space-y-4 p-4">
          <div className="relative">
            {loadingA ? (
              <div className="flex h-11 items-center justify-center rounded-md border bg-gray-50 text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando catálogo...
              </div>
            ) : (
              <select className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]">
                <option value="">Selecciona un producto de formación...</option>
                {matricesA.map((mat) => (
                  <option key={mat.id || mat._id} value={mat.id || mat._id}>
                    {mat.nombreProducto || mat.nombre || 'Producto sin nombre'}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-[#F1F5F9] p-3">
            <div className="shrink-0 rounded bg-[#D4E4FA] p-2 text-[#005496]">
              <LinkIcon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs leading-tight font-semibold text-gray-900">
                Selecciona la matriz arriba
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                El documento quedará vinculado al producto oficial
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz B */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-[#F8FAFC] p-3 text-center text-sm font-medium text-[#005496]">
          Matriz B — Ágora
        </div>
        <div className="flex-1 space-y-4 p-4">
          <div className="relative">
            {loadingB ? (
              <div className="flex h-11 items-center justify-center rounded-md border bg-gray-50 text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando repositorio...
              </div>
            ) : (
              <select className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]">
                <option value="">Selecciona un artículo...</option>
                {matricesB.map((mat) => (
                  <option key={mat.id || mat._id} value={mat.id || mat._id}>
                    {mat.tituloArticulo || mat.titulo || 'Artículo sin título'}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-[#F1F5F9] p-3">
            <div className="shrink-0 rounded bg-[#D4E4FA] p-2 text-[#005496]">
              <LinkIcon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs leading-tight font-semibold text-gray-900">
                Vinculación editorial
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                Asocia la carga actual a la red de contenido Ágora
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
