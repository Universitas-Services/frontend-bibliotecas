import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { FileDown, FileCheck, ClipboardList, FileX, Info, Trash2 } from 'lucide-react'

export type DocumentStatus = 'devuelto' | 'publicado' | 'en-revision' | 'rechazado'

export interface DocumentData {
  id: string
  title: string
  subtitle: string
  status: DocumentStatus
  revisor: string
  fecha: string
  isExpanded?: boolean
  comments?: unknown[]
  rechazoMotivo?: string
}

export function DocumentCard({ doc }: { doc: DocumentData }) {
  const statusStyles = {
    devuelto: {
      icon: FileDown,
      iconBg: 'bg-[#FEF08A]',
      iconColor: 'text-[#D97706]',
      badgeBg: 'bg-[#FEF08A]',
      badgeText: 'text-[#D97706]',
      badgeLabel: 'DEVUELTO',
    },
    publicado: {
      icon: FileCheck,
      iconBg: 'bg-[#DCFCE7]',
      iconColor: 'text-[#16A34A]',
      badgeBg: 'bg-[#DCFCE7]',
      badgeText: 'text-[#16A34A]',
      badgeLabel: 'PUBLICADO',
    },
    'en-revision': {
      icon: ClipboardList,
      iconBg: 'bg-[#00315C]',
      iconColor: 'text-white',
      badgeBg: 'bg-[#00315C]',
      badgeText: 'text-white',
      badgeLabel: 'EN REVISIÓN',
    },
    rechazado: {
      icon: FileX,
      iconBg: 'bg-[#FEE2E2]',
      iconColor: 'text-[#93000A]',
      badgeBg: 'bg-[#FEE2E2]',
      badgeText: 'text-[#93000A]',
      badgeLabel: 'RECHAZADO',
    },
  }

  const s = statusStyles[doc.status]
  const Icon = s.icon

  return (
    <div
      className={`mb-4 overflow-hidden rounded-xl border bg-[#FAFAFA] shadow-sm transition-all ${doc.isExpanded ? 'border-[#E5E7EB]' : 'border-[#C1C7D2]'}`}
    >
      {/* Header */}
      <div
        className={`flex flex-col justify-between gap-6 p-5 md:flex-row md:items-center ${doc.isExpanded ? 'bg-[#F9FAFB]' : 'bg-[#FAFAFA]'}`}
      >
        <div className="flex flex-1 items-start gap-4">
          <div
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${s.iconBg}`}
          >
            <Icon className={`h-5 w-5 ${s.iconColor}`} />
          </div>
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-3">
              <h3 className="font-['Inter'] text-[15px] font-bold text-[#0F1D30]">{doc.title}</h3>
              <Badge
                variant="secondary"
                className={`px-2 py-0.5 text-[10px] font-bold hover:bg-transparent ${s.badgeBg} ${s.badgeText} tracking-wider uppercase`}
              >
                {s.badgeLabel}
              </Badge>
            </div>
            <p className="line-clamp-1 text-[13px] font-medium text-[#6B7280]">{doc.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 md:justify-end md:gap-10">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="mb-0.5 text-[10px] font-bold text-[#C1C7D2] uppercase">
                {doc.status === 'rechazado' ? 'ESTADO' : 'REVISOR'}
              </span>
              <span
                className={`text-[13px] font-bold ${doc.status === 'rechazado' ? 'text-[#93000A]' : 'text-[#404551]'}`}
              >
                {doc.status === 'rechazado' ? doc.rechazoMotivo : doc.revisor}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="mb-0.5 text-[10px] font-bold text-[#C1C7D2] uppercase">FECHA</span>
              <span className="text-[13px] font-bold text-[#404551]">{doc.fecha}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {doc.status === 'devuelto' && (
              <>
                <Button
                  variant="outline"
                  className="h-9 border-[#C1C7D2] bg-white text-[13px] font-semibold text-[#404551]"
                >
                  Ver Comentarios
                </Button>
                <Link href={`/curador/correcciones/${doc.id}`}>
                  <Button className="h-9 bg-[#00315C] px-6 text-[13px] font-semibold text-white hover:bg-[#005496]">
                    Corregir
                  </Button>
                </Link>
              </>
            )}
            {doc.status === 'publicado' && (
              <>
                <Link href={`/curador/correcciones/${doc.id}`}>
                  <Button
                    variant="outline"
                    className="h-9 border-[#C1C7D2] bg-white text-[13px] font-semibold text-[#404551]"
                  >
                    Detalles
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-[#C1C7D2] bg-white text-[#6B7280] hover:text-[#93000A]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {doc.status === 'en-revision' && (
              <Link href={`/curador/correcciones/${doc.id}`}>
                <Button
                  variant="outline"
                  className="h-9 border-[#C1C7D2] bg-white text-[13px] font-semibold text-[#005496]"
                >
                  Ver Estado
                </Button>
              </Link>
            )}
            {doc.status === 'rechazado' && (
              <>
                <Button
                  variant="outline"
                  className="h-9 border-transparent text-[13px] font-semibold text-[#93000A] hover:bg-transparent"
                >
                  Ver Motivo
                </Button>
                <Link href={`/curador/correcciones/${doc.id}`}>
                  <Button
                    variant="outline"
                    className="h-9 border-[#C1C7D2] bg-white text-[13px] font-semibold text-[#404551]"
                  >
                    Apelar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Area */}
      {doc.isExpanded && doc.status === 'devuelto' && (
        <div className="bg-white p-6">
          <div className="border-l-2 border-[#E5E7EB] pl-6">
            {/* Alert */}
            <div className="mb-6 flex items-center gap-3 rounded-md border border-[#FED7AA] bg-[#FFF7ED] p-4">
              <Info className="h-5 w-5 shrink-0 text-[#D97706]" />
              <p className="text-[13px] font-semibold text-[#D97706]">
                Este documento fue redirigido a Dr. Silva para una revisión secundaria debido a la
                complejidad técnica.
              </p>
            </div>

            {/* Comments Thread */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-[#10130B] text-sm font-semibold text-white">
                    DS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#0F1D30]">Dr. Silva</span>
                    <span className="text-[13px] font-semibold text-[#C1C7D2]">hace 2 horas</span>
                  </div>
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-4 text-[14px] font-medium text-[#404551] shadow-sm">
                    &quot;Hay discrepancias significativas en la digitalización de la página 45. La
                    taxonomía aplicada no corresponde al marco jurídico actualizado de 2024. Por
                    favor, re-categorizar los linderos.&quot;
                  </div>
                </div>
              </div>

              {/* Reply Box */}
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005496] text-white">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col overflow-hidden rounded-md bg-[#00315C]">
                  <Textarea
                    placeholder="Responder al revisor..."
                    className="min-h-[70px] resize-none rounded-none border-0 bg-transparent p-4 text-[13px] font-medium text-white placeholder:text-[#6B7280] focus-visible:ring-0"
                  />
                  <div className="flex justify-end p-3 pt-0">
                    <Button className="h-9 bg-[#005496] px-6 text-[13px] font-bold text-white hover:bg-[#499DFE]">
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
