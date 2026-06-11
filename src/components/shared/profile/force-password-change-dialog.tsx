'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ForcePasswordChangeDialogProps = {
  open: boolean
  profilePath: string
}

export function ForcePasswordChangeDialog({ open, profilePath }: ForcePasswordChangeDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl text-[#0F1D30]">
            Cambio de contraseña obligatorio
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-slate-600">
            Su cuenta fue creada con una contraseña temporal. Por seguridad, debe establecer una
            contraseña personal antes de continuar usando la plataforma.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild className="w-full bg-[#005496] hover:bg-[#00315C]">
            <Link href={`${profilePath}#cambiar-contraseña`}>Ir a cambiar contraseña</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
