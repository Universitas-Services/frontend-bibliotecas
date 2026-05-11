import { CuradorPageContainer } from "@/components/curador/curador-page-container"
import { Card } from "@/components/ui/card"
import { MetadataForm } from "@/components/curador/metadata-form"
import { UploadZone } from "@/components/curador/upload-zone"

export default function NuevaCargaPage() {
  return (
    <CuradorPageContainer
      title="Curador de Biblioteca"
      description="Gestión y digitalización de acervo documental."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Zona de Upload */}
        <div className="lg:col-span-4">
          <UploadZone />
        </div>

        {/* Columna Derecha: Formulario de Metadatos */}
        <div className="lg:col-span-8">
          <Card className="p-8 min-h-[500px]">
            <MetadataForm />
          </Card>
        </div>
      </div>
    </CuradorPageContainer>
  )
}
