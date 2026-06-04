'use client'

import { useState, useTransition } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { crearTipoDocumentoAction, type TemaPrincipal } from '@/app/actions/temas'

interface NuevoTipoDocumentoFormProps {
  temas: TemaPrincipal[]
}

export function NuevoTipoDocumentoForm({ temas }: NuevoTipoDocumentoFormProps) {
  const [isPending, startTransition] = useTransition()

  const [temaId, setTemaId] = useState('')
  const [tipoDocumento, setTipoDocumento] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const isFormValid = temaId.trim() !== '' && tipoDocumento.trim() !== ''

  const handleCreate = async () => {
    if (!isFormValid) return

    startTransition(async () => {
      const result = await crearTipoDocumentoAction(temaId, tipoDocumento, descripcion)

      if (result.error) {
        toast.error('Error al crear tipo de documento', {
          description: result.error,
        })
      } else {
        toast.success('Tipo de documento creado', {
          description: `Se ha creado el tipo de documento exitosamente.`,
        })
        setTipoDocumento('')
        setDescripcion('')
        setTemaId('')
      }
    })
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-[#1e3a5f]">
        Registrar nuevo tipo de documento
      </h2>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="temaPrincipal" className="text-sm font-medium text-slate-700">
            Tema principal <span className="text-red-500">*</span>
          </Label>
          <Select value={temaId} onValueChange={setTemaId} disabled={isPending}>
            <SelectTrigger id="temaPrincipal" className="w-full bg-slate-50">
              <SelectValue placeholder="Seleccione un tema" />
            </SelectTrigger>
            <SelectContent>
              {temas.map((tema) => (
                <SelectItem key={tema.id} value={tema.id}>
                  {tema.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoDocumento" className="text-sm font-medium text-slate-700">
            Nombre del tipo de documento <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tipoDocumento"
            placeholder="Ej. Legislación, Jurisprudencia..."
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            disabled={isPending}
            className="bg-slate-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion" className="text-sm font-medium text-slate-700">
            Descripción
          </Label>
          <Textarea
            id="descripcion"
            placeholder="Describe brevemente este tipo de documento..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={isPending}
            className="min-h-[100px] resize-y bg-slate-50"
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={handleCreate}
            disabled={!isFormValid || isPending}
            className="w-full bg-[#003D6F] font-medium hover:bg-[#00315C]"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar tipo de documento
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
