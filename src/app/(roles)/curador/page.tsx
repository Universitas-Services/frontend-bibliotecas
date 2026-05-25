import { SummaryCards } from '@/components/curador/dashboard/summary-cards'
import { WeeklyActivityChart } from '@/components/curador/dashboard/weekly-activity-chart'
import { RecentActions } from '@/components/curador/dashboard/recent-actions'
import { RecentDocumentsTable } from '@/components/curador/dashboard/recent-documents-table'

export default function CuradorDashboardPage() {
  return (
    <div className="animate-in fade-in mx-auto w-full max-w-[1400px] p-6 duration-500 md:p-8">
      <div className="mb-8">
        <h1 className="mb-1 font-['Space_Grotesk'] text-[32px] font-bold tracking-tight text-[#0F1D30]">
          Panel de Control
        </h1>
        <p className="text-[15px] font-medium text-[#6B7280]">
          Bienvenido de nuevo, Dr. Ricardo. Aquí tiene un resumen de la actividad de curaduría.
        </p>
      </div>

      <SummaryCards />

      <div className="grid gap-6 md:grid-cols-3">
        <WeeklyActivityChart />
        <RecentActions />
      </div>

      <RecentDocumentsTable />
    </div>
  )
}
