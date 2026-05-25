'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Lun', cargas: 80, aprobaciones: 50 },
  { name: 'Mar', cargas: 120, aprobaciones: 100 },
  { name: 'Mié', cargas: 110, aprobaciones: 100 },
  { name: 'Jue', cargas: 180, aprobaciones: 150 },
  { name: 'Vie', cargas: 120, aprobaciones: 100 },
  { name: 'Sáb', cargas: 60, aprobaciones: 40 },
  { name: 'Dom', cargas: 30, aprobaciones: 20 },
]

export function WeeklyActivityChart() {
  return (
    <Card className="col-span-1 border-[#C1C7D2] shadow-sm md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-[#0F1D30]">Actividad Semanal</CardTitle>
        <div className="flex items-center gap-4 text-xs font-medium text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#005496]" /> Cargas
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#D4E4FA]" /> Aprobaciones
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-6 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={-25}>
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} hide />
              <Tooltip
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #C1C7D2',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="cargas" fill="#D4E4FA" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="aprobaciones" fill="#00315C" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
