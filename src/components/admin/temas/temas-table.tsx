'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Trash2 } from 'lucide-react'
import { toastError, toastSuccess } from '@/lib/toast-messages'
import { USER_MSG } from '@/lib/user-messages'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { TemaPrincipal, Especialista } from './mock-data'
import { AsignarRevisoresSheet } from './asignar-revisores-sheet'
import { asignarPersonalAction, removerPersonalAction } from '@/app/actions/personal'
import { eliminarTemaAction } from '@/app/actions/temas'

interface TemasTableProps {
  initialTemas: TemaPrincipal[]
}

export function TemasTable({ initialTemas }: TemasTableProps) {
  const [temas, setTemas] = useState<TemaPrincipal[]>(initialTemas)
  const [selectedTema, setSelectedTema] = useState<TemaPrincipal | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = (temaId: string) => {
    const confirmed = window.confirm('¿Está seguro de que desea eliminar este tema?')
    if (!confirmed) return

    startTransition(async () => {
      const result = await eliminarTemaAction(temaId)
      if (result.data) {
        toastSuccess(USER_MSG.success.temaDeleted)
        setTemas(temas.filter((t) => t.id !== temaId))
        router.refresh()
      } else {
        toastError(USER_MSG.error.deleteTema, result.error)
      }
    })
  }

  const handleEditClick = (tema: TemaPrincipal) => {
    setSelectedTema(tema)
    setIsSheetOpen(true)
  }

  const handleSaveRevisores = (temaId: string, revisores: Especialista[]) => {
    const temaActual = temas.find((t) => t.id === temaId)
    const previousIds = new Set(temaActual?.revisoresAsignados.map((r) => r.id) || [])
    const newIds = new Set(revisores.map((r) => r.id))

    startTransition(async () => {
      const errors: string[] = []

      for (const userId of newIds) {
        if (!previousIds.has(userId)) {
          const result = await asignarPersonalAction(temaId, userId)
          if (!result.success) errors.push(result.error)
        }
      }

      for (const userId of previousIds) {
        if (!newIds.has(userId)) {
          const result = await removerPersonalAction(temaId, userId)
          if (!result.success) errors.push(result.error)
        }
      }

      if (errors.length > 0) {
        toastError(USER_MSG.error.saveAssignments, errors.join('\n'))
        return
      }

      setTemas(temas.map((t) => (t.id === temaId ? { ...t, revisoresAsignados: revisores } : t)))
      setIsSheetOpen(false)
      toastSuccess(USER_MSG.success.staffAssigned)
      router.refresh()
    })
  }

  const toggleStatus = (temaId: string) => {
    setTemas(temas.map((t) => (t.id === temaId ? { ...t, activo: !t.activo } : t)))
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-800">Matriz de enrutamiento</h2>
      </div>
      <Table>
        <TableHeader className="bg-slate-50 text-xs text-slate-500">
          <TableRow>
            <TableHead className="font-medium">Tema principal</TableHead>
            <TableHead className="text-center font-medium">Revisores asignados</TableHead>
            <TableHead className="text-center font-medium">estado actual</TableHead>
            <TableHead className="w-[120px] text-center font-medium">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {temas.map((tema) => (
            <TableRow key={tema.id}>
              <TableCell className="font-medium text-slate-800">{tema.nombre}</TableCell>
              <TableCell className="text-center">
                {tema.revisoresAsignados.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    {tema.revisoresAsignados.map((rev) => (
                      <Badge
                        key={rev.id}
                        variant="secondary"
                        className="border border-[#c1c4f5] bg-[#e5e7ff] font-medium text-[#4a4d9e]"
                      >
                        {rev.nombre.includes('Dr') ||
                        rev.nombre.includes('Mtra') ||
                        rev.nombre.includes('Lic')
                          ? rev.nombre.split(' ').slice(1).join(' ') // Simplificado para mostrar algo parecido a "Revisor 1" o el nombre
                          : rev.nombre}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm font-medium text-[#e27d35]">
                    Sin especialista asignado
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={tema.activo}
                  onCheckedChange={() => toggleStatus(tema.id)}
                  className={tema.activo ? 'data-[state=checked]:bg-green-500' : ''}
                />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(tema)}
                    className="h-8 w-8 border border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-900"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => handleDelete(tema.id)}
                    className="h-8 w-8 border border-transparent text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AsignarRevisoresSheet
        tema={selectedTema}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={handleSaveRevisores}
        isSaving={isPending}
      />
    </div>
  )
}
