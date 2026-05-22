import { FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { getPreviewUrlAction } from '@/app/actions/documents'

export async function DocumentPreview({ documentId }: { documentId: string }) {
  const response = await getPreviewUrlAction(documentId)

  return (
    <div className="flex h-[700px] flex-col overflow-hidden rounded-xl border border-[#C1C7D2] bg-[#10130B] shadow-sm">
      {/* Top bar */}
      <div className="flex h-10 items-center justify-between border-b border-[#36383D] bg-[#0F1D30] px-4 text-[#C1C7D2]">
        <div className="text-[12px] font-semibold tracking-wide">Visualizador de Documento</div>
      </div>

      {/* Document content */}
      <div className="relative flex flex-1 justify-center overflow-hidden bg-[#2A2F3A]">
        {response.success && response.url ? (
          <iframe
            src={`${response.url}#toolbar=0&navpanes=0`}
            className="h-full w-full border-none"
            title="Previsualización del PDF"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
            <p className="font-bold text-red-200">No se pudo cargar la previsualización</p>
            <p className="mt-2 text-sm text-white/60">{response.error || 'Error desconocido'}</p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-[#36383D] bg-[#050810] p-4 text-white">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#C1C7D2]" />
          <div className="flex flex-col">
            <span className="max-w-[200px] truncate text-[13px] font-bold">
              ID: {documentId.substring(0, 8)}...
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#499DFE]" />
            <div className="text-[12px] leading-tight font-bold text-[#499DFE]">
              GCS
              <br />
              SEGURO
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
