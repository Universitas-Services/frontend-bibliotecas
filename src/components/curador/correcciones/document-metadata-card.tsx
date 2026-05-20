import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function DocumentMetadataCard() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-[#E5E7EB] bg-[#F9FAFB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB] bg-white pb-4">
          <CardTitle className="text-[18px] font-bold text-[#00315C]">
            Ficha del documento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="m-4 rounded-md border-b border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Título Íntegro
            </h4>
            <p className="text-[15px] leading-snug font-semibold text-[#005496]">
              Modificación del Código Civil y Comercial de la Nación respecto a Contratos de
              Locación.
            </p>
          </div>
          <div className="mx-4 mb-4 rounded-md border-b border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Título breve
            </h4>
            <p className="text-[15px] font-semibold text-[#00315C]">Ley de Alquileres 2023</p>
          </div>

          <div className="mx-4 mb-4 flex gap-4">
            <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-2 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Tipo de norma
              </h4>
              <Badge className="rounded-sm bg-[#10130B] px-2.5 py-0.5 text-[10px] font-bold uppercase hover:bg-[#10130B]">
                LEY NACIONAL
              </Badge>
            </div>
            <div className="flex-1 rounded-md bg-white p-5 shadow-sm">
              <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
                Rama del derecho
              </h4>
              <p className="text-[14px] font-bold text-[#00315C]">Derecho Civil</p>
            </div>
          </div>

          <div className="mx-4 mb-5 rounded-md bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">
              Ente emisor
            </h4>
            <p className="text-[14px] font-bold text-[#005496]">Congreso de la Nación Argentina</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5E7EB] bg-[#F9FAFB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB] bg-white pb-3">
          <CardTitle className="text-[11px] font-bold tracking-wider text-[#6B7280] uppercase">
            RESUMEN DESCRIPTIVO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="rounded-md bg-white p-6 text-[14px] leading-relaxed font-medium text-[#404551] shadow-sm">
            Establece nuevas normativas para los contratos de locación de inmuebles destinados a
            vivienda, modificando disposiciones del Código Civil y Comercial relacionadas con
            domicilios especiales, plazos mínimos, depósitos de garantía y mecanismos de
            actualización de cánones.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
