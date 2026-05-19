import { CloudUpload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export function UploadZone() {
  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-[#F8FAFC] p-10 text-center">
        <CloudUpload className="mb-4 h-12 w-12 text-gray-500" strokeWidth={1.5} />
        <h3 className="mb-2 font-medium text-gray-800">Arrastra el documento original aquí</h3>
        <p className="mb-6 text-sm text-gray-500">Solo formato PDF — Máx. 50MB</p>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            Examinar archivos
          </Button>
          <span className="text-sm text-gray-500">Tamaño: 0.0 MB</span>
        </div>
      </div>

      {/* OCR Checkbox */}
      <div className="flex items-start space-x-3">
        <Checkbox id="ocr" className="mt-1 border-gray-300" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="ocr"
            className="cursor-pointer text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Solo lectura de imagen (desactivar OCR)
          </label>
          <p className="text-sm leading-relaxed text-gray-500">
            Active esta opción si el documento es una imagen pura o un escaneo que no requiere
            procesamiento de texto inteligente.
          </p>
        </div>
      </div>
    </div>
  )
}
