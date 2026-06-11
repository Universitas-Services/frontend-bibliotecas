'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileCheck, ClipboardList, FileText } from 'lucide-react'

import { DocumentActions } from '@/components/curador/document-actions'
import type { DocumentStatus } from '@/lib/document-status'
import { DOCUMENT_STATUS_STYLES } from '@/lib/document-status'

export type { DocumentStatus }

export interface DocumentData {
  id: string
  title: string
  subtitle: string
  status: DocumentStatus
  revisor: string
  fecha: string
}

const STATUS_ICONS = {
  publicado: FileCheck,
  'en-revision': ClipboardList,
  borrador: FileText,
} as const

const ICON_STYLES = {
  publicado: { iconBg: 'bg-[#DCFCE7]', iconColor: 'text-[#16A34A]' },
  'en-revision': { iconBg: 'bg-[#00315C]', iconColor: 'text-white' },
  borrador: { iconBg: 'bg-[#E5E7EB]', iconColor: 'text-[#404551]' },
} as const

export function DocumentCard({ doc }: { doc: DocumentData }) {
  const styles = DOCUMENT_STATUS_STYLES[doc.status]
  const iconStyles = ICON_STYLES[doc.status]
  const Icon = STATUS_ICONS[doc.status]

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-[#C1C7D2] bg-[#FAFAFA] shadow-sm transition-all">
      <div className="flex flex-col justify-between gap-6 bg-[#FAFAFA] p-5 md:flex-row md:items-center">
        <div className="flex flex-1 items-start gap-4">
          <div
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconStyles.iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconStyles.iconColor}`} />
          </div>
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-3">
              <h3 className="font-['Inter'] text-[15px] font-bold text-[#0F1D30]">{doc.title}</h3>
              <Badge
                variant="secondary"
                className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase hover:bg-transparent ${styles.badgeBg} ${styles.badgeText}`}
              >
                {styles.label}
              </Badge>
            </div>
            <p className="line-clamp-1 text-[13px] font-medium text-[#6B7280]">{doc.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 md:justify-end md:gap-10">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="mb-0.5 text-[10px] font-bold text-[#C1C7D2] uppercase">REVISOR</span>
              <span className="text-[13px] font-bold text-[#404551]">{doc.revisor}</span>
            </div>
            <div className="flex flex-col">
              <span className="mb-0.5 text-[10px] font-bold text-[#C1C7D2] uppercase">FECHA</span>
              <span className="text-[13px] font-bold text-[#404551]">{doc.fecha}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {doc.status === 'borrador' && (
              <Button size="sm" className="h-9 bg-[#005496] hover:bg-[#00315C]" asChild>
                <Link href={`/curador/nueva-carga?edit=${doc.id}`}>Continuar edición</Link>
              </Button>
            )}
            <DocumentActions documentId={doc.id} status={doc.status} variant="buttons" />
          </div>
        </div>
      </div>
    </div>
  )
}
