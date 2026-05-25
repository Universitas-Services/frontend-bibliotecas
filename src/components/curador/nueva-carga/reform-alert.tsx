import { Switch } from '@/components/ui/switch'
import { AlertTriangle, Link as LinkIcon } from 'lucide-react'

export function ReformAlert() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5C9A0] bg-[#FAF3E0] p-6">
      <div className="mb-6 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 shrink-0 text-[#D97706]" strokeWidth={2} />
        <div>
          <h3 className="mb-1 text-[15px] font-semibold text-[#D97706]">
            Alerta —<br />
            Posible reforma
          </h3>
          <p className="text-sm leading-relaxed text-[#D97706]">
            El sistema ha detectado fragmentos coincidentes con la Ley 12/2022. Se sugiere revisar
            jerarquía.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-[#3F3F46]">Declarar como Reforma</span>
        <Switch className="data-[state=checked]:bg-[#005496]" defaultChecked />
      </div>

      <div className="rounded-lg border border-[#F6E3C5] bg-[#FFF9EE] p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#D97706]">
          <LinkIcon className="h-4 w-4" strokeWidth={2.5} />
          Ley Orgánica 12/2022
        </div>
        <p className="text-[11px] leading-snug text-[#D97706]">
          &quot;Nota: Esta acción reemplazará la vigencia de los artículos 15 al 22 del documento
          original.&quot;
        </p>
      </div>
    </div>
  )
}
