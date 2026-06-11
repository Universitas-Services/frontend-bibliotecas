import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUp, CheckCircle2, ClipboardList } from 'lucide-react'

import type { DashboardStats } from '@/lib/curador-dashboard'

type SummaryCardsProps = {
  stats: DashboardStats
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const publicadoPct = stats.total > 0 ? Math.round((stats.publicados / stats.total) * 100) : 0

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <Card className="border-[#C1C7D2] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-wider text-[#6B7280] uppercase">
            Artículos Cargados
          </CardTitle>
          <FileUp className="h-5 w-5 text-[#005496]" />
        </CardHeader>
        <CardContent>
          <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#00315C]">
            {stats.total}
          </div>
          <p className="mt-2 text-xs font-medium text-[#6B7280]">Total en su gestión documental</p>
        </CardContent>
      </Card>

      <Card className="border-[#C1C7D2] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-wider text-[#6B7280] uppercase">
            Publicados
          </CardTitle>
          <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
        </CardHeader>
        <CardContent>
          <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#00315C]">
            {stats.publicados}
          </div>
          <p className="mt-2 text-xs font-medium text-[#6B7280]">
            {publicadoPct}% del total cargado
          </p>
        </CardContent>
      </Card>

      <Card className="border-[#C1C7D2] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-wider text-[#6B7280] uppercase">
            En Revisión
          </CardTitle>
          <ClipboardList className="h-5 w-5 text-[#005496]" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#00315C]">
              {stats.enRevision}
            </div>
            <div className="mt-1 rounded-full bg-[#D4E4FA] px-2.5 py-1 text-xs font-semibold text-[#005496]">
              {stats.borradores} borradores
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-[#6B7280]">Pendientes de aprobación</p>
        </CardContent>
      </Card>
    </div>
  )
}
