'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'

import { resetPasswordAction, type ResetPasswordState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toastError } from '@/lib/toast-messages'
import { toUserFacingMessage, USER_MSG } from '@/lib/user-messages'

const initialState: ResetPasswordState | null = null

type ResetPasswordFormProps = {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (state?.error) {
      toastError('No pudimos restablecer la contraseña', toUserFacingMessage(state.error))
    }
  }, [state?.error])

  if (!token) {
    return (
      <div className="rounded-xl bg-[#404551] p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-sans text-2xl font-medium tracking-wide text-white">
            Enlace no válido
          </h1>
          <p className="text-sm text-[#C1C7D2]">
            El enlace de recuperación está incompleto o ha expirado. Solicite uno nuevo desde la
            pantalla de inicio de sesión.
          </p>
        </div>
        <Button asChild className="h-12 w-full bg-[#005496] text-white hover:bg-[#003D6F]">
          <Link href="/auth/forgot-password">Solicitar nuevo enlace</Link>
        </Button>
      </div>
    )
  }

  if (state?.success) {
    return (
      <div className="rounded-xl bg-[#404551] p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-sans text-2xl font-medium tracking-wide text-white">
            Contraseña actualizada
          </h1>
          <p className="text-sm text-[#C1C7D2]">
            {state.message ?? USER_MSG.success.passwordUpdated} Inicie sesión con su correo y la
            nueva contraseña que acaba de definir.
          </p>
        </div>
        <Button asChild className="h-12 w-full bg-[#005496] text-white hover:bg-[#003D6F]">
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-[#404551] p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-sans text-2xl font-medium tracking-wide text-white">
          Nueva contraseña
        </h1>
        <p className="text-sm text-[#C1C7D2]">
          Defina una contraseña segura para recuperar el acceso a su cuenta.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            className="text-xs font-semibold tracking-wider text-[#C1C7D2] uppercase"
          >
            Nueva contraseña
          </Label>
          <div className="relative">
            <Lock
              className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
              strokeWidth={1.5}
            />
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              required
              className="h-12 border-none bg-[#050810] pr-10 pl-11 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#005496]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-[#9CA3AF]">
            Mínimo 8 caracteres, una mayúscula y un carácter especial.
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-semibold tracking-wider text-[#C1C7D2] uppercase"
          >
            Confirmar contraseña
          </Label>
          <div className="relative">
            <Lock
              className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
              strokeWidth={1.5}
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repita la nueva contraseña"
              required
              className="h-12 border-none bg-[#050810] pr-10 pl-11 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#005496]"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full bg-[#005496] text-white hover:bg-[#003D6F]"
        >
          {isPending ? 'GUARDANDO...' : 'RESTABLECER CONTRASEÑA'}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#C1C7D2] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  )
}
