import { FileText, CheckCircle2 } from 'lucide-react'

export function DocumentPreview() {
  return (
    <div className="flex h-[700px] flex-col overflow-hidden rounded-xl border border-[#C1C7D2] bg-[#10130B] shadow-sm">
      {/* Top bar */}
      <div className="flex h-10 items-center justify-between border-b border-[#36383D] bg-[#0F1D30] px-4 text-[#C1C7D2]">
        <div className="text-[12px] font-semibold tracking-wide">Visualizador de Documento</div>
      </div>

      {/* Document content */}
      <div className="flex flex-1 justify-center overflow-y-auto bg-[#2A2F3A] p-6">
        <div className="w-full max-w-[450px] rounded-sm bg-white p-8 font-serif text-[14px] leading-relaxed text-[#10130B] shadow-2xl">
          <p className="mb-4">75 del Código Civil y Comercial de la Nación por el siguiente:</p>
          <div className="-mx-3 mb-4 border-l-4 border-[#D97706] bg-[#FEF08A]/70 px-3 py-2 shadow-sm">
            <strong>Artículo 75: Domicilio especial.</strong>
            <br />
            Las partes de un contrato pueden elegir un domicilio para el ejercicio de los derechos y
            obligaciones que de él emanan. Pueden además constituir un domicilio electrónico en el
            cual se tengan por eficaces y válidas todas las notificaciones, comunicaciones y
            emplazamientos que allí se dirijan.
          </div>
          <p className="mb-3 font-bold">
            Artículo 2º.- Sustitúyese el artículo 1.196 del Código Civil y Comercial de la Nación
            por el siguiente:
          </p>
          <p className="mb-2">
            Artículo 1.196: Locación habitacional. Si el destino es habitacional, no puede
            requerirse del locatario:
          </p>
          <p className="mb-2 ml-5">
            a) El pago de alquileres anticipados por períodos mayores a un mes;
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-[#36383D] bg-[#050810] p-4 text-white">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#C1C7D2]" />
          <div className="flex flex-col">
            <span className="max-w-[200px] truncate text-[13px] font-bold">
              ley_alquileres_2023_scan.pdf
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-[12px] leading-tight font-bold text-[#C1C7D2]">
            2.4
            <br />
            MB
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#499DFE]" />
            <div className="text-[12px] leading-tight font-bold text-[#499DFE]">
              OCR
              <br />
              98%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
