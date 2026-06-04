'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { crearTemaAction } from '@/app/actions/temas'

export default function CrearTemaPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [nombreTema, setNombreTema] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreTema.trim()) {
      toast.error('El nombre del tema es requerido')
      return
    }

    startTransition(async () => {
      const response = await crearTemaAction(nombreTema.trim(), descripcion.trim())

      if (response.error) {
        toast.error('Error al crear el tema', {
          description: response.error || response.details,
        })
        return
      }

      toast.success('Tema principal creado exitosamente')
      router.push('/admin/taxonomia/temas')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl p-4 pt-10 sm:p-6 lg:p-8">
      {/* Header con botón de regresar */}
      <div className="mb-8">
        <Link
          href="/admin/taxonomia/temas"
          className="mb-4 inline-flex items-center text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la matriz de temas
        </Link>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1e3a5f]">
          Crear nuevo tema principal
        </h1>
        <p className="text-lg text-slate-500">
          Complete los detalles para registrar una nueva área temática en el sistema.
        </p>
      </div>

      <div className="mb-8 w-full border-b border-slate-200" />

      {/* Formulario */}
      <div className="rounded-lg border bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Nombre del tema</label>
            <Input
              value={nombreTema}
              onChange={(e) => setNombreTema(e.target.value)}
              placeholder="Ej. Derecho Civil"
              className="max-w-md border-slate-200 bg-slate-50"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Descripción del tema
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describa el propósito y alcance de este tema..."
              className="flex min-h-[80px] w-full max-w-md rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending}
            />
          </div>

          <div className="rounded-r-md border-l-4 border-[#0f3b68] bg-[#f5f7ff] p-4 text-sm text-slate-600">
            Al crear el tema, este se inyectará automáticamente en el menú desplegable de carga del
            curador, pero iniciará <strong>sin especialistas asignados</strong>. Deberá asignarlos
            desde la matriz de enrutamiento.
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" asChild className="bg-white" disabled={isPending}>
              <Link href="/admin/taxonomia/temas">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              className="bg-[#0f3b68] text-white hover:bg-[#0a2847]"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isPending ? 'Guardando...' : 'Guardar tema'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
