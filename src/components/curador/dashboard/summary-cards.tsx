import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUp, CheckCircle2, ClipboardList } from 'lucide-react'

export function SummaryCards() {
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
          <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#00315C]">1,248</div>
          <p className="mt-2 flex items-center text-xs font-medium text-[#16A34A]">
            <span className="mr-1">↗</span> +12% vs. mes anterior
          </p>
        </CardContent>
      </Card>

      <Card className="border-[#C1C7D2] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-wider text-[#6B7280] uppercase">
            Artículos Aprobados
          </CardTitle>
          <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
        </CardHeader>
        <CardContent>
          <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#00315C]">1,012</div>
          <p className="mt-2 text-xs font-medium text-[#6B7280]">81% del total cargado</p>
        </CardContent>
      </Card>

      <Card className="border-[#C1C7D2] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-wider text-[#6B7280] uppercase">
            En Revisión
          </CardTitle>
          <ClipboardList className="h-5 w-5 text-[#93000A]" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="font-['Space_Grotesk'] text-4xl font-bold text-[#00315C]">45</div>
            <div className="mt-1 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-xs font-semibold text-[#93000A]">
              12 devueltos
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-[#6B7280]">Acción requerida inmediata</p>
        </CardContent>
      </Card>
    </div>
  )
}
