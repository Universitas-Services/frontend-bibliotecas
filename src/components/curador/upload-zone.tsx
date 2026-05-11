"use client"

import * as React from "react"
import { UploadCloud, File, X, Camera } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useUploadStore } from "@/lib/stores/upload-store"

export function UploadZone() {
  const [dragActive, setDragActive] = React.useState(false)
  const { file, setFile, isImageOnly, setIsImageOnly } = useUploadStore()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validar tipo (PDF o Imagen)
    const validTypes = ["application/pdf", "image/jpeg", "image/png"]
    if (!validTypes.includes(file.type)) {
      alert("Por favor, sube solo archivos PDF, JPG o PNG.")
      return
    }

    // Validar tamaño (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("El archivo es demasiado grande. El máximo es 50MB.")
      return
    }

    setFile(file)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  const clearFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Zona de Drop */}
      <Card
        className={cn(
          "relative p-8 flex flex-col items-center justify-center border-dashed border-2 min-h-[320px] text-center transition-all duration-200",
          dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-zinc-200 bg-white",
          file ? "border-solid border-zinc-200" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
        />

        {!file ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-500 shadow-sm">
              <UploadCloud className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Arrastrar PDF o Imagen</h3>
              <p className="text-sm text-muted-foreground mt-1 px-4">
                Formatos soportados: .pdf, .jpg, .png (Max 50MB)
              </p>
            </div>
            <button
              onClick={onButtonClick}
              className="mt-2 bg-black hover:bg-zinc-800 text-white px-8 py-2.5 font-bold text-sm rounded-md transition-colors"
            >
              Seleccionar Archivo
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center p-4">
            <div className="p-4 bg-zinc-100 rounded-2xl text-zinc-600 mb-4">
              <File className="w-12 h-12" />
            </div>
            <div className="w-full max-w-[200px] text-center mb-6">
              <p className="font-bold text-sm truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              onClick={clearFile}
              className="flex items-center gap-2 text-destructive text-xs font-bold hover:underline"
            >
              <X className="h-4 w-4" />
              Eliminar archivo
            </button>
          </div>
        )}
      </Card>

      {/* Procesamiento de texto */}
      <Card className="p-6 border-zinc-200 bg-white">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
            <Camera className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-zinc-900">Procesamiento de Texto</h4>
            <p className="text-[12px] leading-relaxed text-muted-foreground mt-1">
              El sistema extrae texto automáticamente para búsqueda. Activa esta opción si el documento es puramente visual.
            </p>
          </div>
        </div>
        
        <div className="mt-5 flex items-center justify-between p-4 bg-zinc-50/80 rounded-xl border border-zinc-100">
          <Label htmlFor="ocr-bypass" className="text-xs font-bold text-zinc-700 cursor-pointer">
            Solo Foto/Imagen (bypass ocr)
          </Label>
          <Switch 
            id="ocr-bypass" 
            checked={isImageOnly}
            onCheckedChange={setIsImageOnly}
          />
        </div>
      </Card>
    </div>
  )
}
