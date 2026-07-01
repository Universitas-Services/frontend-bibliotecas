'use client'

import { useState, useTransition, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormCombobox } from '@/components/admin/form-combobox'
import { crearTipoNormaAction, getTiposDocumentoAction } from '@/app/actions/temas'
import type { TemaPrincipal, Subcarpeta } from '@/app/actions/temas'

type NuevoInstrumentoFormProps = {
  temas: TemaPrincipal[]
}

export function NuevoInstrumentoForm({ temas }: NuevoInstrumentoFormProps) {
  const [isPending, startTransition] = useTransition()

  // Nivel 1: Tema
  const [temaId, setTemaId] = useState('')

  // Nivel 2: Tipo Documento
  const [tiposDocumento, setTiposDocumento] = useState<Subcarpeta[]>([])
  const [subcarpetaId, setSubcarpetaId] = useState('')
  const [isLoadingDocumentos, setIsLoadingDocumentos] = useState(false)

  // Nivel 3: Tipo Norma
  const [nombreCarpeta, setNombreCarpeta] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const temaOptions = temas.map((t) => ({ value: t.id, label: t.nombre }))
  const documentoOptions = tiposDocumento.map((d) => ({ value: d.id, label: d.tipoNorma }))

  // Fetch Nivel 2 cuando Nivel 1 cambia
  useEffect(() => {
    if (!temaId) return

    let isMounted = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingDocumentos(true)

    getTiposDocumentoAction(temaId)
      .then((data) => {
        if (isMounted) {
          setTiposDocumento(data)
          setIsLoadingDocumentos(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingDocumentos(false)
          toastError(USER_MSG.error.loadTiposDocumento)
        }
      })

    return () => {
      isMounted = false
    }
  }, [temaId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!temaId) {
      toastError(USER_MSG.validation.temaRequired)
      return
    }
    if (!subcarpetaId) {
      toastError(USER_MSG.validation.tipoDocumentoRequired)
      return
    }
    if (!nombreCarpeta.trim()) {
      toastError(USER_MSG.validation.instrumentoName)
      return
    }

    startTransition(async () => {
      const response = await crearTipoNormaAction(
        subcarpetaId,
        nombreCarpeta.trim(),
        descripcion.trim(),
      )

      if (response.error) {
        toastError(USER_MSG.error.createTipoNorma, response.error || response.details)
        return
      }

      toastSuccess(USER_MSG.success.tipoNormaCreated)
      setNombreCarpeta('')
      setDescripcion('')
      setSubcarpetaId('')
      setTemaId('')
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-lg border bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-800">Nuevo instrumento (Tipo de norma)</h2>

      <div className="space-y-4">
        {/* Nivel 1 */}
        <FormCombobox
          id="temaId"
          label="1. Tema principal asociado"
          options={temaOptions}
          value={temaId}
          onValueChange={(val) => {
            setTemaId(val)
            setSubcarpetaId('')
            setTiposDocumento([])
          }}
          placeholder="Seleccione el tema principal"
          searchPlaceholder="Buscar tema..."
          disabled={isPending}
        />

        {/* Nivel 2 */}
        <div className="relative">
          <FormCombobox
            id="subcarpetaId"
            label="2. Tipo de documento asociado"
            options={documentoOptions}
            value={subcarpetaId}
            onValueChange={setSubcarpetaId}
            placeholder={
              temaId
                ? tiposDocumento.length > 0
                  ? 'Seleccione un tipo de documento'
                  : 'No hay tipos de documento para este tema'
                : 'Seleccione primero un tema'
            }
            searchPlaceholder="Buscar tipo de documento..."
            disabled={!temaId || isLoadingDocumentos || isPending || tiposDocumento.length === 0}
          />
          {isLoadingDocumentos && (
            <div className="absolute top-8 right-12">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          )}
        </div>

        {/* Nivel 3 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            3. Nombre del instrumento (Tipo de norma)
          </label>
          <Input
            value={nombreCarpeta}
            onChange={(e) => setNombreCarpeta(e.target.value)}
            placeholder="Ej. Ley ordinaria, Decreto..."
            className="border-slate-200 bg-slate-50"
            disabled={!subcarpetaId || isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Descripción corta</label>
          <Textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa el propósito y alcance jurídico de este tipo de norma..."
            className="h-28 resize-none border-slate-200 bg-slate-50"
            disabled={!subcarpetaId || isPending}
          />
        </div>
      </div>

      <div className="rounded-r-md border-l-4 border-[#0f3b68] bg-[#f5f7ff] p-4 text-sm leading-relaxed text-slate-600">
        Los instrumentos creados alimentarán automáticamente el desplegable de ingesta del curador y
        las facetas del buscador público.
      </div>

      <Button
        type="submit"
        disabled={!subcarpetaId || isPending}
        className="w-full bg-[#0f3b68] text-white hover:bg-[#0a2847]"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {isPending ? 'Creando...' : 'Crear tipo de norma'}
      </Button>
    </form>
  )
}
