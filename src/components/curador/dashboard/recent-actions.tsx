import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ClipboardList, AlertCircle } from 'lucide-react'

import type { DashboardStats } from '@/lib/curador-dashboard'

type RecentActionsProps = {
  stats: DashboardStats
}

export function RecentActions({ stats }: RecentActionsProps) {
  const items = [
    {
      icon: FileText,
      label: `${stats.borradores} borradores por completar`,
      href: '/curador/gestion-documental?estado=borradores',
      show: stats.borradores > 0,
    },
    {
      icon: ClipboardList,
      label: `${stats.enRevision} documentos en revisión`,
      href: '/curador/gestion-documental?estado=en-revision',
      show: stats.enRevision > 0,
    },
    {
      icon: AlertCircle,
      label: 'Revisar correcciones del administrador',
      href: '/curador/correcciones',
      show: true,
    },
  ].filter((item) => item.show)

  return (
    <Card className="border-[#C1C7D2] shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#0F1D30]">Acciones pendientes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-[#6B7280]">No hay acciones pendientes por ahora.</p>
        ) : (
          items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-3 transition-colors hover:bg-[#F9FAFB]"
            >
              <item.icon className="h-4 w-4 text-[#005496]" />
              <span className="text-sm font-medium text-[#404551]">{item.label}</span>
            </Link>
          ))
        )}
        <Button variant="link" className="h-auto p-0 text-[#005496]" asChild>
          <Link href="/curador/gestion-documental">Ver gestión documental</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
