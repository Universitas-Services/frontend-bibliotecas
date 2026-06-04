import { Input } from '@/components/ui/input'
import { Info } from 'lucide-react'

export function LegalIdentification() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-[#00315C]">
          Título oficial / íntegro
          <Info className="h-4 w-4 text-gray-400" strokeWidth={2} />
        </label>
        <Input
          name="tituloIntegro"
          required
          placeholder="Escriba el nombre completo del instrumento legal..."
          className="h-11 border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-[#00315C]">
          Nombre breve / comercial
          <Info className="h-4 w-4 text-gray-400" strokeWidth={2} />
        </label>
        <Input
          name="nombreBreve"
          placeholder="Ej: Ley de Protección de Datos 2024"
          className="h-11 border-gray-300"
        />
      </div>
    </div>
  )
}
