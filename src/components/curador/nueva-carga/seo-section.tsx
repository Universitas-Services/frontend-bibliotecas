'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CharacterCounter } from '@/components/ui/character-counter'
import { SEO_LIMITS } from '@/lib/seo-limits'

type SeoSectionProps = {
  initialResumen?: string
  initialEtiquetas?: string[]
}

export function SeoSection({ initialResumen = '', initialEtiquetas = [] }: SeoSectionProps) {
  const [resumen, setResumen] = useState(initialResumen)
  const [etiquetas, setEtiquetas] = useState<string[]>(initialEtiquetas)
  const [etiquetaInput, setEtiquetaInput] = useState('')

  const addEtiqueta = () => {
    const trimmed = etiquetaInput.trim().slice(0, SEO_LIMITS.keywordMaxLength)
    if (!trimmed) return
    if (etiquetas.length >= SEO_LIMITS.maxKeywords) return
    if (etiquetas.includes(trimmed)) {
      setEtiquetaInput('')
      return
    }
    setEtiquetas((prev) => [...prev, trimmed])
    setEtiquetaInput('')
  }

  const handleEtiquetaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addEtiqueta()
    }
  }

  const removeEtiqueta = (etiqueta: string) => {
    setEtiquetas((prev) => prev.filter((k) => k !== etiqueta))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#00315C]">
            Resumen descriptivo
            <span className="ml-1 text-red-500">*</span>
          </label>
          <CharacterCounter current={resumen.length} max={SEO_LIMITS.resumen} />
        </div>
        <Textarea
          name="resumen"
          value={resumen}
          onChange={(e) => setResumen(e.target.value.slice(0, SEO_LIMITS.resumen))}
          maxLength={SEO_LIMITS.resumen}
          placeholder="Redacte un resumen ejecutivo para fines de indexación y búsqueda rápida..."
          className="min-h-[120px] resize-none border-gray-300 bg-white p-4"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#00315C]">Etiquetas</label>
          <CharacterCounter current={etiquetas.length} max={SEO_LIMITS.maxKeywords} />
        </div>
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
          {etiquetas.map((etiqueta) => (
            <Badge
              key={etiqueta}
              variant="secondary"
              className="flex items-center gap-1.5 rounded-full bg-[#E2E8F0] px-3 py-1 font-normal text-[#334155] hover:bg-[#CBD5E1]"
            >
              {etiqueta}
              <button
                type="button"
                onClick={() => removeEtiqueta(etiqueta)}
                className="rounded-full hover:text-red-600"
                aria-label={`Quitar ${etiqueta}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {etiquetas.length < SEO_LIMITS.maxKeywords ? (
            <input
              type="text"
              value={etiquetaInput}
              onChange={(e) =>
                setEtiquetaInput(e.target.value.slice(0, SEO_LIMITS.keywordMaxLength))
              }
              onKeyDown={handleEtiquetaKeyDown}
              maxLength={SEO_LIMITS.keywordMaxLength}
              placeholder="Escriba y presione Enter..."
              className="ml-2 min-w-[150px] flex-1 border-none bg-transparent text-sm text-gray-500 outline-none"
            />
          ) : null}
        </div>
        <input type="hidden" name="etiquetas" value={JSON.stringify(etiquetas)} />
      </div>
    </div>
  )
}
