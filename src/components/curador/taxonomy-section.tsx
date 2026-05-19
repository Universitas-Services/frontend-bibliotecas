import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TaxonomySection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Tema principal</label>
        <Select>
          <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
            <SelectValue placeholder="Seleccione un área temática..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="propiedad-intelectual">Propiedad Intelectual</SelectItem>
            <SelectItem value="normativa-digital">Normativa Digital</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-3 rounded-md border border-[#F6C07B] bg-[#FFF4E5] p-4 text-[#A8610A]">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
        <p className="text-sm">
          Aviso: El tema seleccionado determinará los flujos de revisión automáticos.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Categorías asignadas</label>
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
          <Badge className="flex items-center gap-1.5 rounded-full bg-[#003D6F] px-3 py-1 font-normal text-white hover:bg-[#00315C]">
            Propiedad Intelectual <X className="h-3 w-3 cursor-pointer" />
          </Badge>
          <Badge className="flex items-center gap-1.5 rounded-full bg-[#003D6F] px-3 py-1 font-normal text-white hover:bg-[#00315C]">
            Normativa Digital <X className="h-3 w-3 cursor-pointer" />
          </Badge>
          <input
            type="text"
            placeholder="Añadir categoría..."
            className="ml-2 min-w-[150px] flex-1 border-none bg-transparent text-sm text-gray-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-[#00315C]">Etiquetas</label>
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="secondary"
            className="rounded-full border border-[#B3D4FF] bg-[#EBF3FF] px-4 py-1.5 font-normal text-[#005496] hover:bg-[#D4E4FA]"
          >
            #ProtecciónDatos
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full border border-[#B3D4FF] bg-[#EBF3FF] px-4 py-1.5 font-normal text-[#005496] hover:bg-[#D4E4FA]"
          >
            #GDPR_EU
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 gap-2 rounded-full bg-gray-200 px-4 text-xs text-gray-700 hover:bg-gray-300"
          >
            <Sparkles className="h-3 w-3" />
            Sugiero IA
          </Button>
        </div>
      </div>
    </div>
  )
}
