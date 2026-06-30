import { AlertCircle } from 'lucide-react'

import { getPreviewUrlAction } from '@/app/actions/documents'
import { USER_MSG } from '@/lib/user-messages'

export async function DocumentPreview({ documentId }: { documentId: string }) {
  const response = await getPreviewUrlAction(documentId)

  return (
    <div className="flex h-[700px] flex-col overflow-hidden rounded-xl border border-[#C1C7D2] bg-[#10130B] shadow-sm">
      <div className="flex h-10 items-center justify-between border-b border-[#36383D] bg-[#0F1D30] px-4 text-[#C1C7D2]">
        <div className="text-[12px] font-semibold tracking-wide">Visualizador de documento</div>
      </div>

      <div className="relative flex flex-1 justify-center overflow-hidden bg-[#2A2F3A]">
        {response.success && response.url ? (
          <iframe
            src={`${response.url}#toolbar=0&navpanes=0`}
            className="h-full w-full border-none"
            title="Previsualización del PDF"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-base font-semibold text-red-100">{USER_MSG.preview.title}</p>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              {response.error || USER_MSG.preview.description}
            </p>
            <p className="max-w-md text-xs text-white/45">{USER_MSG.common.tryAgainLater}</p>
          </div>
        )}
      </div>
    </div>
  )
}
