import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, CheckCircle2, FileX, UploadCloud } from 'lucide-react'

const actions = [
  {
    id: 1,
    title: 'Edición de Artículo #4521',
    subtitle: 'Hace 15 min • Derecho Civil',
    icon: Pencil,
    iconBg: 'bg-[#D4E4FA]',
    iconColor: 'text-[#005496]',
  },
  {
    id: 2,
    title: 'Aprobación Lote OCR',
    subtitle: 'Hace 2 horas • Dr. Ricardo',
    icon: CheckCircle2,
    iconBg: 'bg-[#DCFCE7]',
    iconColor: 'text-[#16A34A]',
  },
  {
    id: 3,
    title: 'Documento Devuelto',
    subtitle: 'Hace 4 horas • Error de Formato',
    icon: FileX,
    iconBg: 'bg-[#FEE2E2]',
    iconColor: 'text-[#93000A]',
  },
  {
    id: 4,
    title: 'Nueva Carga Masiva',
    subtitle: 'Ayer • 250 Archivos PDF',
    icon: UploadCloud,
    iconBg: 'bg-[#D4E4FA]',
    iconColor: 'text-[#005496]',
  },
]

export function RecentActions() {
  return (
    <Card className="border-[#C1C7D2] shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-lg font-bold text-[#0F1D30]">Últimas Acciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {actions.map((action) => (
            <div key={action.id} className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${action.iconBg}`}
              >
                <action.icon className={`h-4 w-4 ${action.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#0F1D30]">{action.title}</span>
                <span className="mt-0.5 text-xs font-semibold text-[#6B7280]">
                  {action.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button className="text-[13px] font-bold text-[#005496] hover:underline">
            Ver todo el historial
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
