'use client'

import { useState } from 'react'
import { CloudUpload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type UploadZoneProps = {
  disabled?: boolean
  onFileSelected: (file: File | null) => void
  initialFileName?: string
  initialOcr?: boolean
}

export function UploadZone({
  disabled = false,
  onFileSelected,
  initialFileName,
  initialOcr,
}: UploadZoneProps) {
  const [fileName, setFileName] = useState<string | null>(initialFileName || null)
  const [fileSize, setFileSize] = useState<string>(initialFileName ? 'Ya subido' : '0.0 MB')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB')
      onFileSelected(file)
      return
    }
    setFileName(null)
    setFileSize('0.0 MB')
    onFileSelected(null)
  }

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-[#F8FAFC] p-10 text-center transition-colors hover:bg-gray-50">
        <input
          type="file"
          name="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          disabled={disabled}
          onChange={handleFileChange}
        />
        <CloudUpload
          className={`mb-4 h-12 w-12 ${fileName ? 'text-green-500' : 'text-gray-500'}`}
          strokeWidth={1.5}
        />
        <h3 className="mb-2 font-medium text-gray-800">
          {fileName
            ? fileName
            : initialFileName
              ? 'Arrastra un nuevo documento para reemplazarlo'
              : 'Arrastra el documento original aquí o haz clic'}
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          {fileName ? 'Documento listo para subir' : 'Solo formato PDF, DOC — Máx. 50MB'}
        </p>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="pointer-events-none border-gray-300 bg-white text-gray-700"
          >
            {fileName ? 'Cambiar archivo' : 'Examinar archivos'}
          </Button>
          <span className="text-sm text-gray-500">Tamaño: {fileSize}</span>
        </div>
      </label>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="ocr"
          name="soloLecturaImagen"
          value="true"
          defaultChecked={initialOcr}
          className="mt-1 border-gray-300"
          disabled={disabled}
        />
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
