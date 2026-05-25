import { AlertTriangle, MessageSquare } from 'lucide-react'

export function RevisionHistory() {
  return (
    <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 shadow-sm">
      <h3 className="mb-6 text-[18px] font-bold text-[#0F1D30]">Historial de revisión</h3>

      <div className="relative ml-2 space-y-8 border-l-2 border-[#E5E7EB] pb-4 pl-5">
        {/* Step 1 */}
        <div className="relative">
          <div className="absolute top-0 -left-[33px] flex h-7 w-7 items-center justify-center rounded-full bg-[#10130B] text-[11px] font-bold text-white ring-4 ring-[#F9FAFB]">
            LM
          </div>
          <div className="pl-4">
            <div className="mb-0.5 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#0F1D30]">Carga inicial (OCR)</span>
              <span className="text-[11px] font-bold text-[#6B7280]">10 Oct, 09:14</span>
            </div>
            <p className="text-[13px] font-medium text-[#6B7280]">Sistema automatizado</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative">
          <div className="absolute top-0 -left-[33px] flex h-7 w-7 items-center justify-center rounded-full bg-[#E67E22] text-[11px] font-bold text-white ring-4 ring-[#F9FAFB]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="pl-4">
            <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
              <span className="text-[14px] font-bold text-[#0F1D30]">Asignación de revisión</span>
              <span className="text-[11px] font-bold text-[#6B7280]">10 Oct, 10:30</span>
            </div>

            <div className="mt-3 rounded-md border border-[#FED7AA] bg-[#FFF7ED] p-4 shadow-sm">
              <div className="mb-1 flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
                <span className="text-[13px] font-bold text-[#D97706]">
                  Redirigido a Dr. Martínez
                </span>
              </div>
              <p className="pl-6 text-[13px] font-medium text-[#D97706]">
                Requiere análisis de especialista en Derecho Civil Inmobiliario.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative">
          <div className="absolute top-0 -left-[33px] flex h-7 w-7 items-center justify-center rounded-full bg-[#10130B] text-[11px] font-bold text-white ring-4 ring-[#F9FAFB]">
            RM
          </div>
          <div className="pl-4">
            <div className="mb-3 flex flex-col justify-between sm:flex-row sm:items-center">
              <span className="text-[14px] font-bold text-[#D97706]">Documento devuelto</span>
              <span className="text-[11px] font-bold text-[#6B7280]">12 Oct, 14:45</span>
            </div>
            <div className="relative rounded-md border border-[#E5E7EB] bg-white p-5 text-[13px] leading-relaxed font-medium text-[#404551] shadow-sm">
              <MessageSquare className="absolute top-5 right-5 h-4 w-4 text-[#C1C7D2]" />
              Hay discrepancias en la digitalización del Artículo 1.196 inciso B. Por favor,
              verificar contra el PDF original y ajustar los metadatos correspondientes antes de
              aprobar.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
