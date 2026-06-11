'use client'

import { useActionState, useEffect, useState } from 'react'
import { Eye, EyeOff, KeyRound, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { changePasswordAction, type ChangePasswordState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type ChangePasswordFormProps = {
  forced?: boolean
  homePath: string
}

const initialState: ChangePasswordState | null = null

export function ChangePasswordForm({ forced = false, homePath }: ChangePasswordFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }

    if (state?.sessionExpired) {
      toast.error(state.error || 'Tu sesión expiró. Por favor vuelve a iniciar sesión.')
      router.replace('/login?logout=1')
      return
    }

    if (state?.success) {
      toast.success(state.message || 'Contraseña actualizada.')
      router.refresh()
      if (forced) {
        router.push(homePath)
      }
    }
  }, [state, forced, homePath, router])

  return (
    <Card
      id="cambiar-contraseña"
      className={cn(
        'border-slate-200 shadow-sm',
        forced && 'border-amber-200 ring-2 ring-amber-100',
      )}
    >
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00315C] text-white">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-[#0F1D30]">Cambiar contraseña</CardTitle>
            <CardDescription>
              {forced
                ? 'Debe establecer una contraseña personal antes de continuar usando la plataforma.'
                : 'Actualice su contraseña de acceso. Use una clave segura y distinta a la temporal.'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="flow" value="profile" />
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Ingrese su contraseña temporal o actual"
                className="pr-10 pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres, mayúscula y símbolo"
                className="pr-10 pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Mínimo 8 caracteres, al menos una mayúscula y un carácter especial.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repita la nueva contraseña"
                className="pr-10 pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <Button type="submit" disabled={isPending} className="bg-[#005496] hover:bg-[#00315C]">
              {isPending
                ? 'Guardando...'
                : forced
                  ? 'Guardar y continuar'
                  : 'Actualizar contraseña'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
