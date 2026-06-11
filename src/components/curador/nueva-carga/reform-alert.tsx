'use client'

import { useEffect, useState, useTransition } from 'react'
import { AlertTriangle, Link as LinkIcon, Loader2, Search } from 'lucide-react'

import { getCuradorDocumentsAction } from '@/app/actions/curador-documents'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type LawOption = {
  id: string
  titulo: string
}

export function ReformAlert() {
  const [isReforma, setIsReforma] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLaw, setSelectedLaw] = useState<LawOption | null>(null)
  const [results, setResults] = useState<LawOption[]>([])
  const [isSearching, startSearchTransition] = useTransition()

  const canSearch = isReforma && searchTerm.trim().length >= 2
  const visibleResults = canSearch && !selectedLaw ? results : []

  const handleReformaChange = (checked: boolean) => {
    setIsReforma(checked)
    if (!checked) {
      setSearchTerm('')
      setSelectedLaw(null)
      setResults([])
    }
  }

  useEffect(() => {
    if (!canSearch) {
      return
    }

    const query = searchTerm.trim()
    const timeout = setTimeout(() => {
      startSearchTransition(async () => {
        const response = await getCuradorDocumentsAction({
          busqueda: query,
          limit: 8,
        })

        if (!response.success) {
          setResults([])
          return
        }

        const options = response.data.documents
          .map((doc) => {
            const id = String(doc.id || doc._id || '')
            const titulo = String(doc.titulo || doc.tituloIntegro || 'Documento sin título')
            return id ? { id, titulo } : null
          })
          .filter((item): item is LawOption => item !== null)

        setResults(options)
      })
    }, 350)

    return () => clearTimeout(timeout)
  }, [canSearch, searchTerm])

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5C9A0] bg-[#FAF3E0] p-6">
      <input type="hidden" name="esReforma" value={isReforma ? 'true' : 'false'} />
      <input type="hidden" name="leyViejaId" value={selectedLaw?.id || ''} />

      <div className="mb-6 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 shrink-0 text-[#D97706]" strokeWidth={2} />
        <div>
          <h3 className="mb-1 text-[15px] font-semibold text-[#D97706]">¿Es una reforma?</h3>
          <p className="text-sm leading-relaxed text-[#D97706]">
            Solo actívelo si este documento modifica o sustituye una norma ya publicada en la
            biblioteca. Usted, como curador, es quien conoce si aplica.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Label htmlFor="declarar-reforma" className="text-sm font-medium text-[#3F3F46]">
          Declarar como reforma
        </Label>
        <Switch
          id="declarar-reforma"
          checked={isReforma}
          onCheckedChange={handleReformaChange}
          className="data-[state=checked]:bg-[#005496]"
        />
      </div>

      {isReforma ? (
        <div className="space-y-4 rounded-lg border border-[#F6E3C5] bg-[#FFF9EE] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#D97706]">
            <LinkIcon className="h-4 w-4" strokeWidth={2.5} />
            Ley que está siendo reformada
          </div>

          <div className="space-y-2">
            <Label htmlFor="ley-busqueda" className="text-xs text-[#92400E]">
              Buscar documento original
            </Label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#D97706]/70" />
              <Input
                id="ley-busqueda"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setSelectedLaw(null)
                  setResults([])
                }}
                placeholder="Escriba título o palabras clave..."
                className="border-[#F6E3C5] bg-white pl-10"
              />
            </div>
          </div>

          {isSearching ? (
            <div className="flex items-center gap-2 text-xs text-[#D97706]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Buscando...
            </div>
          ) : null}

          {visibleResults.length > 0 ? (
            <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-[#F6E3C5] bg-white p-1">
              {visibleResults.map((law) => (
                <li key={law.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLaw(law)
                      setSearchTerm(law.titulo)
                      setResults([])
                    }}
                    className={cn(
                      'w-full rounded px-3 py-2 text-left text-xs transition-colors hover:bg-[#FAF3E0]',
                      selectedLaw?.id === law.id && 'bg-[#FAF3E0] font-medium text-[#D97706]',
                    )}
                  >
                    {law.titulo}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {selectedLaw ? (
            <p className="text-[11px] leading-snug text-[#D97706]">
              Documento seleccionado: <strong>{selectedLaw.titulo}</strong>. Al publicar como
              reforma, la ley original pasará a estado legal REFORMADA.
            </p>
          ) : (
            <p className="text-[11px] leading-snug text-[#D97706]">
              Seleccione la ley vigente que este documento modifica o sustituye.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
