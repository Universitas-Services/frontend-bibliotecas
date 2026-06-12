'use client'

import Link from 'next/link'
import { SendHorizontal } from 'lucide-react'

import { CuradorPreviewActions } from '@/components/curador/curador-preview-actions'
import { Button } from '@/components/ui/button'

type CorrectionsActionsProps = {
  documentId: string
}

export function CorrectionsFooter({ documentId }: CorrectionsActionsProps) {
  return (
    <CuradorPreviewActions>
      <Button variant="outline" className="h-11 px-6 font-semibold" asChild>
        <Link href="/curador/correcciones">Volver al listado</Link>
      </Button>
      <Button className="h-11 bg-[#005496] px-6 font-semibold hover:bg-[#00315C]" asChild>
        <Link href={`/curador/nueva-carga?edit=${documentId}&reenviar=1`}>
          <SendHorizontal className="mr-2 h-4 w-4" />
          Corregir y Reenviar
        </Link>
      </Button>
    </CuradorPreviewActions>
  )
}

export function CorrectionsLastUpdated({ lastUpdated }: { lastUpdated: string }) {
  return (
    <p className="mt-2 text-[12px] font-semibold text-[#6B7280]">
      Última actualización: {lastUpdated}
    </p>
  )
}
