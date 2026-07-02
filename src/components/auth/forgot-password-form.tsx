'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

import { forgotPasswordAction, type ForgotPasswordState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toastError } from '@/lib/toast-messages'
import { toUserFacingMessage } from '@/lib/user-messages'

const initialState: ForgotPasswordState | null = null

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState)

  useEffect(() => {
    if (state?.error) {
      toastError('No pudimos enviar el correo', toUserFacingMessage(state.error))
    }
  }, [state?.error])

  if (state?.success) {
    return (
      <div className="rounded-xl bg-[#404551] p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 font-sans text-2xl font-medium tracking-wide text-white">
            Revise su correo
          </h1>
          <p className="text-sm leading-relaxed text-[#C1C7D2]">
            {state.message ??
              'Si el correo está registrado, recibirá un enlace para restablecer su contraseña en los próximos minutos.'}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#9CA3AF]">
            Al abrir el enlace del correo podrá definir una nueva contraseña y luego volver al
            inicio de sesión con sus credenciales actualizadas.
          </p>
        </div>

        <p className="mb-6 text-center text-xs text-[#9CA3AF]">
          Si no lo encuentra, revise la carpeta de spam o solicite un nuevo enlace.
        </p>

        <div className="space-y-3">
          <Button asChild className="h-12 w-full bg-[#005496] text-white hover:bg-[#003D6F]">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full border-[#5B6270] bg-transparent text-[#C1C7D2] hover:bg-[#050810] hover:text-white"
          >
            <Link href="/auth/forgot-password">Enviar otro enlace</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-[#404551] p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-sans text-2xl font-medium tracking-wide text-white">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-[#C1C7D2]">
          Ingrese su correo institucional y le enviaremos un enlace para restablecer su contraseña.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-semibold tracking-wider text-[#C1C7D2] uppercase"
          >
            Email institucional
          </label>
          <div className="relative">
            <Mail
              className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
              strokeWidth={1.5}
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="usuario@universitas.edu"
              required
              className="h-12 border-none bg-[#050810] pl-11 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#005496]"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full bg-[#005496] text-white hover:bg-[#003D6F]"
        >
          {isPending ? 'ENVIANDO...' : 'ENVIAR ENLACE DE RECUPERACIÓN'}
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
