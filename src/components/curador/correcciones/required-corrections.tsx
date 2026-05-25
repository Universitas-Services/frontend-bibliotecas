import { Checkbox } from '@/components/ui/checkbox'

export function RequiredCorrections() {
  return (
    <div className="flex h-full flex-col rounded-r-xl border-l-[3px] border-[#D97706] bg-[#2A2F3A] p-6 shadow-md">
      <h3 className="mb-6 text-[10px] font-bold tracking-wider text-[#C1C7D2] uppercase">
        CORRECCIONES REQUERIDAS
      </h3>

      <div className="flex-1 space-y-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="c1"
            className="mt-0.5 h-4 w-4 rounded-sm border-[#6B7280] data-[state=checked]:border-[#00315C] data-[state=checked]:bg-[#00315C] data-[state=checked]:text-white"
            checked
          />
          <label
            htmlFor="c1"
            className="cursor-pointer text-[13px] leading-snug font-medium text-[#D4E4FA]"
          >
            Verificar texto íntegro Art. 1.196
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="c2"
            className="mt-0.5 h-4 w-4 rounded-sm border-[#6B7280] data-[state=checked]:border-[#00315C] data-[state=checked]:bg-[#00315C] data-[state=checked]:text-white"
            checked
          />
          <label
            htmlFor="c2"
            className="cursor-pointer text-[13px] leading-snug font-medium text-[#D4E4FA]"
          >
            Completar &apos;Fecha de Promulgación&apos; faltante en metadatos
          </label>
        </div>

        <div className="flex cursor-not-allowed items-start gap-3 opacity-30">
          <Checkbox
            id="c3"
            disabled
            className="mt-0.5 h-4 w-4 rounded-sm border-[#404551] bg-[#404551]"
          />
          <label
            htmlFor="c3"
            className="cursor-not-allowed text-[13px] leading-snug font-medium text-white"
          >
            Verificar texto íntegro Art. 1.196
          </label>
        </div>

        <div className="flex cursor-not-allowed items-start gap-3 opacity-30">
          <Checkbox
            id="c4"
            disabled
            className="mt-0.5 h-4 w-4 rounded-sm border-[#404551] bg-[#404551]"
          />
          <label
            htmlFor="c4"
            className="cursor-not-allowed text-[13px] leading-snug font-medium text-white"
          >
            Verificar texto íntegro Art. 1.196
          </label>
        </div>
      </div>
    </div>
  )
}
