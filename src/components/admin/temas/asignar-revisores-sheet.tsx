'use client'

import { useEffect, useState } from 'react'
import { Search, UserPlus, X, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { listUsersAction } from '@/app/actions/users'
import { TemaPrincipal, Especialista } from './mock-data'

interface AsignarRevisoresSheetProps {
  tema: TemaPrincipal | null
  isOpen: boolean
  onClose: () => void
  onSave: (temaId: string, revisores: Especialista[]) => void
  isSaving?: boolean
}

export function AsignarRevisoresSheet({
  tema,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: AsignarRevisoresSheetProps) {
  if (!tema) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        showCloseButton={false}
        className="flex w-[400px] flex-col gap-0 border-l bg-white p-0 sm:max-w-[540px]"
      >
        {isOpen ? (
          <AsignarRevisoresSheetBody
            key={tema.id}
            tema={tema}
            onClose={onClose}
            onSave={onSave}
            isSaving={isSaving}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function AsignarRevisoresSheetBody({
  tema,
  onClose,
  onSave,
  isSaving = false,
}: {
  tema: TemaPrincipal
  onClose: () => void
  onSave: (temaId: string, revisores: Especialista[]) => void
  isSaving?: boolean
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRevisores, setSelectedRevisores] = useState<Especialista[]>(
    tema.revisoresAsignados || [],
  )
  const [availableUsers, setAvailableUsers] = useState<Especialista[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true)
      const result = await listUsersAction({ role: 'CURADOR', limit: 100 })
      if (result.success && Array.isArray(result.data?.items)) {
        setAvailableUsers(
          result.data.items.map((user: Record<string, unknown>) => ({
            id: String(user.id || user._id || ''),
            nombre: `${String(user.nombre || '')} ${String(user.apellido || '')}`.trim(),
            certificacionNivel2: false,
          })),
        )
      } else {
        setAvailableUsers([])
      }
      setLoadingUsers(false)
    }

    fetchUsers()
  }, [])

  const availableRevisores = availableUsers.filter(
    (e) =>
      !selectedRevisores.find((sr) => sr.id === e.id) &&
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = (especialista: Especialista) => {
    setSelectedRevisores([...selectedRevisores, especialista])
  }

  const handleRemove = (id: string) => {
    setSelectedRevisores(selectedRevisores.filter((e) => e.id !== id))
  }

  const handleSave = () => {
    onSave(tema.id, selectedRevisores)
  }

  return (
    <>
      <SheetHeader className="relative flex flex-row items-start justify-between bg-[#0f3b68] p-6 text-white">
        <div>
          <SheetTitle className="text-left text-xl leading-tight font-normal text-white">
            Asignar personal a <br />
            <span className="font-bold underline decoration-2 underline-offset-4">
              {tema.nombre}
            </span>
          </SheetTitle>
          <SheetDescription className="hidden">
            Asignar curadores al tema seleccionado.
          </SheetDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="-mt-2 -mr-2 text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </SheetHeader>

      <div className="flex flex-1 flex-col space-y-8 overflow-y-auto p-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Curadores disponibles</h3>
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar curador por nombre..."
              className="bg-white pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="divide-y overflow-hidden rounded-md border bg-slate-50">
            {loadingUsers ? (
              <div className="flex items-center justify-center gap-2 p-6 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando curadores...
              </div>
            ) : (
              <>
                {availableRevisores.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{e.nombre}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-500 hover:text-slate-800"
                      onClick={() => handleAdd(e)}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {availableRevisores.length === 0 && !loadingUsers && (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No se encontraron curadores disponibles.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Personal asignado</h3>
          <div className="flex flex-wrap gap-2">
            {selectedRevisores.map((e) => (
              <Badge
                key={e.id}
                variant="secondary"
                className="border border-[#c1c4f5] bg-[#e5e7ff] px-3 py-1.5 text-sm font-medium text-[#4a4d9e] hover:bg-[#d5d7ff]"
              >
                {e.nombre}
                <button
                  type="button"
                  onClick={() => handleRemove(e.id)}
                  className="ml-2 rounded-full p-0.5 hover:bg-[#c1c4f5] focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedRevisores.length === 0 && (
              <span className="text-sm text-slate-500 italic">Ningún curador asignado aún.</span>
            )}
          </div>
        </div>
      </div>

      <SheetFooter className="mt-0 flex w-full shrink-0 flex-col gap-3 border-t bg-slate-50 p-4 sm:flex-row sm:p-6">
        <Button variant="outline" onClick={onClose} className="w-full bg-white sm:w-auto">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-auto w-full bg-[#0f3b68] py-2 whitespace-normal text-white hover:bg-[#0a2847] sm:flex-1"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </SheetFooter>
    </>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
