import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export function MetadataForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Tipo de norma</label>
        <Select name="tipoNorma" defaultValue="ley-organica">
          <SelectTrigger className="h-11 w-full border-gray-300 bg-white">
            <SelectValue placeholder="Seleccione un tipo..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ley-organica">Ley Orgánica</SelectItem>
            <SelectItem value="decreto">Decreto</SelectItem>
            <SelectItem value="resolucion">Resolución</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#00315C]">Ente emisor</label>
        <Input
          name="enteEmisor"
          placeholder="Ej: Ministerio de Justicia"
          className="h-11 border-gray-300 bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#00315C]">Publicación</label>
          <Input
            name="fechaPublicacion"
            placeholder="mm/dd/yyyy"
            type="date"
            className="h-11 border-gray-300 bg-white text-center"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#00315C]">Nº Gaceta</label>
          <Input
            name="numeroGaceta"
            placeholder="Nº 45/24"
            className="h-11 border-gray-300 bg-white text-center"
          />
        </div>
      </div>
    </div>
  )
}
