import { getCuradorDocumentsAction } from '@/app/actions/curador-documents'
import { SummaryCards } from '@/components/curador/dashboard/summary-cards'
import { WeeklyActivityChart } from '@/components/curador/dashboard/weekly-activity-chart'
import { RecentActions } from '@/components/curador/dashboard/recent-actions'
import { RecentDocumentsTable } from '@/components/curador/dashboard/recent-documents-table'
import {
  computeDashboardStats,
  computeWeeklyActivity,
  mapToDashboardDocument,
} from '@/lib/curador-dashboard'
import { getSessionUser } from '@/lib/session'
import { formatSessionDisplayName } from '@/lib/session-shared'

export default async function CuradorDashboardPage() {
  const [documentsResult, session] = await Promise.all([
    getCuradorDocumentsAction({ limit: 100 }),
    getSessionUser(),
  ])

  const rawDocuments = documentsResult.success ? documentsResult.data.documents : []
  const dashboardDocuments = rawDocuments
    .map((doc) => mapToDashboardDocument(doc))
    .sort((left, right) => right.timestamp - left.timestamp)

  const stats = computeDashboardStats(dashboardDocuments)
  const weeklyActivity = computeWeeklyActivity(dashboardDocuments)
  const recentDocuments = dashboardDocuments.slice(0, 5)

  const displayName = formatSessionDisplayName(session.user)

  return (
    <div className="animate-in fade-in mx-auto w-full max-w-[1400px] p-6 duration-500 md:p-8">
      <div className="mb-8">
        <h1 className="mb-1 font-['Space_Grotesk'] text-[32px] font-bold tracking-tight text-[#0F1D30]">
          Panel de Control
        </h1>
        <p className="text-[15px] font-medium text-[#6B7280]">
          Bienvenido de nuevo, {displayName}. Aquí tiene un resumen de la actividad de curaduría.
        </p>
      </div>

      <SummaryCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-3">
        <WeeklyActivityChart data={weeklyActivity} />
        <RecentActions stats={stats} />
      </div>

      <RecentDocumentsTable documents={recentDocuments} />
    </div>
  )
}
