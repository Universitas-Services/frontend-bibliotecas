import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function DocumentPagination() {
  return (
    <div className="mt-8 flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
      <p className="text-[13px] font-semibold text-[#6B7280]">Mostrando 1-10 de 47 documentos</p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md border-[#C1C7D2] bg-white text-[#6B7280]"
          disabled
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-md border-[#005496] bg-[#D4E4FA]/30 px-0 font-bold text-[#005496]"
        >
          1
        </Button>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-md border-[#C1C7D2] bg-white px-0 font-bold text-[#404551] hover:bg-[#F3F4F6]"
        >
          2
        </Button>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-md border-[#C1C7D2] bg-white px-0 font-bold text-[#404551] hover:bg-[#F3F4F6]"
        >
          3
        </Button>
        <div className="px-2 text-sm font-bold text-[#6B7280]">...</div>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-md border-[#C1C7D2] bg-white px-0 font-bold text-[#404551] hover:bg-[#F3F4F6]"
        >
          5
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md border-[#C1C7D2] bg-white text-[#404551] hover:bg-[#F3F4F6]"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
