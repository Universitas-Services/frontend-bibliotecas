'use client'

import { useActionState, useEffect, useState } from 'react'
import { Eye, Newspaper } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createMatrizBAction } from '@/app/actions/matrices'

export function CreateAgoraForm() {
  const [isActive, setIsActive] = useState(true)
  const [state, formAction, isPending] = useActionState(createMatrizBAction, null)

  useEffect(() => {
    if (state?.success) {
      toast.success('Artículo creado exitosamente.')
      // Opcional: limpiar el formulario aquí
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={formAction} className="mx-auto w-full max-w-5xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#00315C]">
          Gestor central del catálogo comercial:
          <br />
          Ingesta de matriz B
        </h1>
        <p className="text-gray-500">Repositorio de Ágora y lecturas recomendadas</p>
      </div>

      <div className="space-y-6">
        {/* Datos del artículo */}
        <div className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="w-2 shrink-0 bg-[#00315C]" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Newspaper className="h-6 w-6 text-[#00315C]" />
              <div>
                <h2 className="text-xl font-bold text-[#00315C]">Datos del artículo</h2>
                <p className="text-sm text-gray-500">Ingresa los datos del articulo</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tituloArticulo">Título del artículo</Label>
                <Input
                  id="tituloArticulo"
                  name="tituloArticulo"
                  required
                  className="bg-gray-100/50"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="autorArticulo">Autor</Label>
                  <Input
                    id="autorArticulo"
                    name="autorArticulo"
                    required
                    className="bg-gray-100/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urlDestinoAgora">Enlace del artículo</Label>
                  <Input
                    id="urlDestinoAgora"
                    name="urlDestinoAgora"
                    type="url"
                    required
                    className="bg-gray-100/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categorias">Categorías (separadas por coma)</Label>
                <Input
                  id="categorias"
                  name="categorias"
                  placeholder="Ej: Lectura, Recomendado"
                  className="bg-gray-100/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel de control de promoción */}
        <div className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="w-2 shrink-0 bg-green-500" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Eye className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-[#00315C]">Panel de control de promoción</h2>
                <p className="text-sm text-gray-500">Descripción</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#cce6d3] bg-[#eef7f0] p-6">
              <div>
                <h3 className="font-bold text-[#00315C]">Estatus activos</h3>
                <p className="text-sm text-gray-600">
                  Si se desactiva, el artículo se oculta de las recomendaciones públicas y del panel
                  del curador sin borrar el registro histórico.
                </p>
              </div>
              <input type="hidden" name="activo" value={isActive.toString()} />
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="outline" className="px-8 font-medium">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#00315C] px-8 font-medium hover:bg-[#002244]"
          >
            {isPending ? 'Guardando...' : 'Guardar y activar artículo'}
          </Button>
        </div>
      </div>
    </form>
  )
}
