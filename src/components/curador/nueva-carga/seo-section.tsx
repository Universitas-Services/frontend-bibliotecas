'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CharacterCounter } from '@/components/ui/character-counter'
import { SEO_LIMITS } from '@/lib/seo-limits'

export function SeoSection() {
  const [resumen, setResumen] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')

  const addKeyword = () => {
    const trimmed = keywordInput.trim().slice(0, SEO_LIMITS.keywordMaxLength)
    if (!trimmed) return
    if (keywords.length >= SEO_LIMITS.maxKeywords) return
    if (keywords.includes(trimmed)) {
      setKeywordInput('')
      return
    }
    setKeywords((prev) => [...prev, trimmed])
    setKeywordInput('')
  }

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#00315C]">Resumen descriptivo</label>
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
          <label className="text-sm font-medium text-[#00315C]">Palabras clave (Keywords)</label>
          <CharacterCounter current={keywords.length} max={SEO_LIMITS.maxKeywords} />
        </div>
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
          {keywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="flex items-center gap-1.5 rounded-full bg-[#E2E8F0] px-3 py-1 font-normal text-[#334155] hover:bg-[#CBD5E1]"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="rounded-full hover:text-red-600"
                aria-label={`Quitar ${keyword}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {keywords.length < SEO_LIMITS.maxKeywords ? (
            <input
              type="text"
              value={keywordInput}
              onChange={(e) =>
                setKeywordInput(e.target.value.slice(0, SEO_LIMITS.keywordMaxLength))
              }
              onKeyDown={handleKeywordKeyDown}
              maxLength={SEO_LIMITS.keywordMaxLength}
              placeholder="Escriba y presione Enter..."
              className="ml-2 min-w-[150px] flex-1 border-none bg-transparent text-sm text-gray-500 outline-none"
            />
          ) : null}
        </div>
        {keywords.map((keyword) => (
          <input key={keyword} type="hidden" name="keywords" value={keyword} />
        ))}
      </div>
    </div>
  )
}
