'use client'

import Link from 'next/link'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type DocumentActionsProps = {
  documentId: string
  variant?: 'icons' | 'buttons'
}

export function DocumentActions({ documentId, variant = 'icons' }: DocumentActionsProps) {
  const handleDelete = () => {
    toast.info('Eliminación pendiente de integración con el backend.')
  }

  const viewLink = `/curador/correcciones/${documentId}`
  const editLink = `/curador/nueva-carga?edit=${documentId}`

  if (variant === 'buttons') {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" className="h-9" asChild>
          <Link href={viewLink}>Ver</Link>
        </Button>
        <Button variant="outline" size="sm" className="h-9" asChild>
          <Link href={editLink}>Editar</Link>
        </Button>
        <DeleteDialog onConfirm={handleDelete} />
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-2 text-[#005496]">
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={viewLink} aria-label="Ver documento">
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <Link href={editLink} aria-label="Editar documento">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <DeleteDialog onConfirm={handleDelete} iconOnly />
    </div>
  )
}

function DeleteDialog({
  onConfirm,
  iconOnly = false,
}: {
  onConfirm: () => void
  iconOnly?: boolean
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {iconOnly ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#005496] hover:text-red-600"
            aria-label="Borrar documento"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-red-600 hover:text-red-700"
            aria-label="Borrar documento"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Borrar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar documento?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El documento se eliminará permanentemente cuando el
            endpoint esté disponible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" type="button" onClick={onConfirm}>
              Eliminar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
