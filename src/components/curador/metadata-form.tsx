"use client"

import * as React from "react"
import { Link2, FileText, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ClassificationTags } from "./classification-tags"
import { useUploadStore } from "@/lib/stores/upload-store"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function MetadataForm() {
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState(false)
  
  const {
    title, setTitle,
    category, setCategory,
    linkedCourse, setLinkedCourse,
    abstract, setAbstract,
    classificationTags, addTag, removeTag,
    keywords, setKeywords,
    file, isImageOnly, reset
  } = useUploadStore()

  const validateAndConfirm = () => {
    if (!file) {
      toast.error("Archivo faltante", {
        description: "Por favor, sube un documento antes de publicar."
      })
      return
    }
    if (!title) {
      toast.error("Título requerido", {
        description: "Por favor, introduce un título para el documento."
      })
      return
    }

    setShowConfirm(true)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    
    // Simular una carga al servidor
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log("Publicando documento...", {
      file,
      isImageOnly,
      title,
      category,
      linkedCourse,
      abstract,
      classificationTags,
      keywords
    })
    
    toast.success("¡Documento publicado!", {
      description: `El documento "${title}" ha sido añadido a la biblioteca.`
    })
    
    setIsPublishing(false)
    setShowConfirm(false)
    reset()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-zinc-500" />
        <h2 className="text-xl font-bold">Metadatos del Documento</h2>
      </div>

      <div className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-zinc-600">Título del Documento *</Label>
          <Input 
            id="title" 
            placeholder="Introduce el título del documento" 
            className="h-12 border-zinc-200 focus-visible:ring-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Categoría y Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-zinc-600">Categoría Principal</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="h-12 border-zinc-200">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiscal">Control Fiscal</SelectItem>
                <SelectItem value="contrataciones">Contrataciones Públicas</SelectItem>
                <SelectItem value="ordenanzas">Ordenanzas Municipales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-zinc-600">Vincular a Curso</Label>
            <div className="relative">
              <Input 
                id="course" 
                placeholder="Vincular a curso" 
                className="h-12 border-zinc-200 pl-4 pr-10"
                value={linkedCourse}
                onChange={(e) => setLinkedCourse(e.target.value)}
              />
              <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="space-y-2">
          <Label htmlFor="abstract" className="text-zinc-600">Resumen o Abstract</Label>
          <Textarea 
            id="abstract" 
            placeholder="Escribe un breve resumen del contenido del documento..." 
            className="min-h-[150px] border-zinc-200 resize-none focus-visible:ring-1"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </div>

        {/* Etiquetas y Palabras Clave */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-zinc-600 font-medium">Etiquetas de Clasificación</Label>
            <ClassificationTags 
              tags={classificationTags} 
              onAddTag={addTag} 
              onRemoveTag={removeTag} 
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="keywords" className="text-zinc-600 font-medium">Palabras Clave (Búsqueda)</Label>
            <Textarea 
              id="keywords" 
              placeholder="Ej: usufructo, prescripción, dolo... Separate con comas." 
              className="min-h-[100px] border-zinc-200 resize-none h-full"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100">
        <Button 
          variant="outline" 
          className="px-8 h-11 font-bold border-zinc-300"
          onClick={() => {
            reset()
            toast.info("Formulario limpiado")
          }}
        >
          Limpiar Formulario
        </Button>
        <Button 
          className="px-8 h-11 font-bold bg-black hover:bg-zinc-800 text-white"
          onClick={validateAndConfirm}
        >
          <Plus className="mr-2 h-4 w-4" />
          Publicar en Biblioteca
        </Button>
      </div>

      {/* Modal de Confirmación */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Publicar en Biblioteca?</DialogTitle>
            <DialogDescription>
              Esta acción añadirá el documento "{title}" al acervo documental. 
              Asegúrate de que los metadatos sean correctos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirm(false)}
              disabled={isPublishing}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-black text-white hover:bg-zinc-800"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? "Publicando..." : "Confirmar y Publicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
