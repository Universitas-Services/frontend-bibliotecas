'use client'

import { useActionState, useEffect, useState } from 'react'
import { CloudUpload, Database, Eye, Image as ImageIcon } from 'lucide-react'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createMatrizAAction } from '@/app/actions/matrices'

export function CreateProductForm() {
  const [isActive, setIsActive] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(createMatrizAAction, null)

  useEffect(() => {
    if (state?.success) {
      toastSuccess(USER_MSG.success.productCreated)
    } else if (state?.error) {
      toastError('No pudimos crear el producto', state.error)
    }
  }, [state])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  return (
    <form action={formAction} className="mx-auto w-full max-w-5xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#00315C]">
          Gestor central del catálogo comercial:
          <br />
          Ingesta de matriz A
        </h1>
        <p className="text-gray-500">
          Complete los campos obligatorios para registrar un nuevo producto en la matriz principal
          del ecosistema legal.
        </p>
      </div>

      <div className="space-y-6">
        {/* Ingesta Técnica */}
        <div className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="w-2 shrink-0 bg-[#00315C]" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Database className="h-6 w-6 text-[#00315C]" />
              <div>
                <h2 className="text-xl font-bold text-[#00315C]">Ingesta técnica</h2>
                <p className="text-sm text-gray-500">Descripción</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombreProducto">Nombre de producto</Label>
                <Input
                  id="nombreProducto"
                  name="nombreProducto"
                  required
                  className="bg-gray-100/50"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipoSolucion">Tipo de solucion</Label>
                  <select
                    id="tipoSolucion"
                    name="tipoSolucion"
                    required
                    className="border-input ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border bg-gray-100/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="CURSO">Curso</option>
                    <option value="MODELO_DESCARGABLE">Modelo Descargable</option>
                    <option value="EVENTO">Evento</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urlDestino">URL destino</Label>
                  <Input
                    id="urlDestino"
                    name="urlDestino"
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
                  placeholder="Ej: Penal, Civil, Laboral"
                  className="bg-gray-100/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Titulo / Imagen */}
        <div className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="w-2 shrink-0 bg-[#1d4ed8]" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <ImageIcon className="h-6 w-6 text-[#1d4ed8]" />
              <div>
                <h2 className="text-xl font-bold text-[#00315C]">Titulo</h2>
                <p className="text-sm text-gray-500">Descripción</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Dropzone */}
              <div>
                <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-200/50 p-6 text-center transition-colors hover:bg-gray-200">
                  <input
                    type="file"
                    name="imagenBanner"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                    <CloudUpload className="h-8 w-8 text-gray-400" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-gray-700">Adjunta el archivo aquí</h3>
                  <p className="text-sm text-gray-500">Arrastra y suelta o haz click para buscar</p>
                </label>
              </div>

              {/* Vista Previa */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Vista previa</p>
                <div className="relative h-48 w-full overflow-hidden rounded-xl border bg-black shadow-sm">
                  {/* Imagen de fondo simulada con gradiente para la vista previa */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-black opacity-80" />
                  {previewUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-40"
                      style={{ backgroundImage: `url(${previewUrl})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                  )}

                  {/* Contenido de la tarjeta */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="mb-2 w-fit rounded-full bg-blue-500/80 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                      Activo
                    </div>
                    <h4 className="text-lg leading-tight font-medium text-white">
                      Curso para hacer cursos
                      <br />
                      de forma profesional
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control de Promoción */}
        <div className="flex overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="w-2 shrink-0 bg-green-500" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Eye className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-[#00315C]">Control de promoción</h2>
                <p className="text-sm text-gray-500">Descripción</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#cce6d3] bg-[#eef7f0] p-6">
              <div>
                <h3 className="font-bold text-[#00315C]">Estatus activos</h3>
                <p className="text-sm text-gray-600">
                  Si se desactiva, el producto se oculta automáticamente de los banners públicos y
                  del buscador del curador.
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
            {isPending ? 'Guardando...' : 'Guardar y publicar en catálogo'}
          </Button>
        </div>
      </div>
    </form>
  )
}
