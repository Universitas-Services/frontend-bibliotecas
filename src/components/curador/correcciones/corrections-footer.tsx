import { Button } from '@/components/ui/button'
import { SendHorizontal } from 'lucide-react'

export function CorrectionsFooter() {
  return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col justify-between gap-4 border-t border-[#36383D] bg-[#10130B] px-6 py-4 sm:flex-row sm:items-center md:left-[16rem] md:w-[calc(100%-16rem)] md:px-12">
      <div className="text-[12px] font-semibold text-[#6B7280]">
        Última actualización: 12 Oct 2023, 14:45
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="h-10 border-[#36383D] bg-transparent px-6 font-semibold text-[#C1C7D2] hover:bg-[#2A2F3A] hover:text-white"
        >
          Escalar a Administrador
        </Button>
        <Button className="flex h-10 items-center gap-2 border-none bg-[#005496] px-6 font-bold text-white hover:bg-[#499DFE]">
          <SendHorizontal className="h-4 w-4" />
          Corregir y Reenviar
        </Button>
      </div>
    </div>
  )
}
