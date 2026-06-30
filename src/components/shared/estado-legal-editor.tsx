'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'

import { patchDocumentEstadoLegalAction } from '@/app/actions/documents'
import { Button } from '@/components/ui/button'
import {
  ESTADO_LEGAL_OPTIONS,
  LEGAL_STATUS_STYLES,
  mapBackendLegalStatus,
  type BackendEstadoLegal,
  type LegalStatus,
} from '@/lib/document-status'

type EstadoLegalEditorProps = {
  documentoId: string
  currentEstadoLegal?: string | null
}

export function EstadoLegalEditor({ documentoId, currentEstadoLegal }: EstadoLegalEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const legalStatus: LegalStatus = mapBackendLegalStatus(currentEstadoLegal)
  const legalStyle = LEGAL_STATUS_STYLES[legalStatus]
  const normalizedCurrent = currentEstadoLegal?.trim().toUpperCase() || ''
  const [selected, setSelected] = useState(
    ESTADO_LEGAL_OPTIONS.some((option) => option.value === normalizedCurrent)
      ? normalizedCurrent
      : '',
  )

  const handleSave = () => {
    if (!selected) {
      toastError(USER_MSG.validation.estadoLegal)
      return
    }

    startTransition(async () => {
      const result = await patchDocumentEstadoLegalAction(
        documentoId,
        selected as BackendEstadoLegal,
      )

      if (!result.success) {
        toastError(
          USER_MSG.error.updateEstadoLegal,
          [result.error, result.details].filter(Boolean).join('\n'),
        )
        return
      }

      toastSuccess(USER_MSG.success.estadoLegalUpdated)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-[#C1C7D2] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#0F1D30]">Estado legal</h3>
          <p className="mt-1 text-sm text-[#6B7280]">
            Clasificación jurídica del instrumento (vigente, reformada o derogada).
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${legalStyle.badgeBg} ${legalStyle.badgeText}`}
        >
          {legalStyle.label}
        </span>
      </div>

      <select
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]"
      >
        <option value="" disabled>
          Seleccione un estado legal
        </option>
        {ESTADO_LEGAL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button
        type="button"
        variant="outline"
        onClick={handleSave}
        disabled={isPending || !selected || selected === normalizedCurrent}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Guardar estado legal
          </>
        )}
      </Button>
    </div>
  )
}
