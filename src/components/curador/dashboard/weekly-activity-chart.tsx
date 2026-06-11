import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { WeeklyActivityPoint } from '@/lib/curador-dashboard'

type WeeklyActivityChartProps = {
  data: WeeklyActivityPoint[]
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const maxCount = Math.max(...data.map((point) => point.count), 1)

  return (
    <Card className="border-[#C1C7D2] shadow-sm md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#0F1D30]">Actividad semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end justify-between gap-2">
          {data.map((point) => (
            <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-[#005496] transition-all"
                style={{
                  height: `${Math.max(8, (point.count / maxCount) * 100)}%`,
                  minHeight: point.count > 0 ? '12px' : '4px',
                  opacity: point.count > 0 ? 1 : 0.2,
                }}
              />
              <span className="text-xs font-medium text-[#6B7280]">{point.day}</span>
              <span className="text-[10px] text-[#9CA3AF]">{point.count}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#6B7280]">
          Documentos actualizados en los últimos 7 días según su gestión documental.
        </p>
      </CardContent>
    </Card>
  )
}
