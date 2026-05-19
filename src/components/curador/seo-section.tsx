import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

export function SeoSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Resumen descriptivo</label>
        <Textarea
          placeholder="Redacte un resumen ejecutivo para fines de indexación y búsqueda rápida..."
          className="min-h-[120px] resize-none border-gray-300 bg-white p-4"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#00315C]">Palabras clave (Keywords)</label>
          <span className="text-xs font-medium text-gray-500">2 / 8</span>
        </div>
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 rounded-full bg-[#E2E8F0] px-3 py-1 font-normal text-[#334155] hover:bg-[#CBD5E1]"
          >
            Legislación <X className="h-3 w-3 cursor-pointer" />
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 rounded-full bg-[#E2E8F0] px-3 py-1 font-normal text-[#334155] hover:bg-[#CBD5E1]"
          >
            Jurisprudencia <X className="h-3 w-3 cursor-pointer" />
          </Badge>
          <input
            type="text"
            placeholder="Escriba y presione Enter..."
            className="ml-2 min-w-[150px] flex-1 border-none bg-transparent text-sm text-gray-500 outline-none"
          />
        </div>
      </div>
    </div>
  )
}
