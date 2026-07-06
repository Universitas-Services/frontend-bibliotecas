'use client'

import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, KeyRound, Lock } from 'lucide-react'
import { toastError } from '@/lib/toast-messages'
import { toUserFacingMessage } from '@/lib/user-messages'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ChangePasswordSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-[#005496] hover:bg-[#00315C]">
      {pending ? 'Guardando...' : 'Guardar y continuar'}
    </Button>
  )
}

export function FirstLoginChangePasswordForm() {
  const searchParams = useSearchParams()
  const changePasswordError = searchParams.get('changePasswordError')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    if (!changePasswordError) return
    toastError('No pudimos actualizar la contraseña', toUserFacingMessage(changePasswordError))
  }, [changePasswordError])

  return (
    <Card className="border-amber-200 shadow-lg ring-1 ring-amber-100">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00315C] text-white">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-[#0F1D30]">Establezca su contraseña</CardTitle>
            <CardDescription>
              Su cuenta fue creada con una contraseña temporal. Debe definir una contraseña personal
              para continuar.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form method="POST" action="/api/auth/change-password" className="space-y-5">
          <input type="hidden" name="flow" value="first-login" />

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña temporal</Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Contraseña asignada por el administrador"
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
                placeholder="Mínimo 8 caracteres"
                className="pr-10 pl-10"
                required
                minLength={8}
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
            <p className="text-xs text-slate-500">Mínimo 8 caracteres.</p>
          </div>

          <ChangePasswordSubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
