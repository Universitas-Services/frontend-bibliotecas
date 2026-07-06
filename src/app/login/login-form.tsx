'use client'

import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { toastError } from '@/lib/toast-messages'
import { toUserFacingMessage, USER_MSG } from '@/lib/user-messages'

const AUTH_REASON_MESSAGES: Record<string, string> = {
  missing: 'No se detectó una sesión activa.',
  expired: 'Su sesión expiró.',
  role: 'No se pudo validar su rol de usuario.',
  profile: 'No se pudo verificar su perfil con el servidor.',
}

function LoginSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-[#005496] text-white transition-colors hover:bg-[#003D6F]"
    >
      {pending ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
      {!pending && <ArrowRight className="h-5 w-5" />}
    </Button>
  )
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const authReason = searchParams.get('authReason')
  const loginError = searchParams.get('loginError')
  const isLogout = searchParams.get('logout') === '1'
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.history.replaceState(null, '', window.location.href)
  }, [])

  useEffect(() => {
    if (!loginError) return
    toastError(USER_MSG.error.login, toUserFacingMessage(loginError))
  }, [loginError])

  const sessionNotice =
    authReason && AUTH_REASON_MESSAGES[authReason]
      ? AUTH_REASON_MESSAGES[authReason]
      : isLogout
        ? 'Sesión cerrada correctamente.'
        : null

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#F8FAFC]">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/LOGO UNIVERSITAS LEGAL.png"
          alt="Universitas Legal"
          className="h-28 w-auto object-contain brightness-0 drop-shadow-md invert"
        />
      </div>

      {/* Card del Login */}
      <div className="w-full max-w-[400px] rounded-xl bg-[#404551] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-sans text-2xl font-medium tracking-wide text-white">
            Acceso Institucional
          </h1>
          <p className="text-sm text-[#C1C7D2]">Ingrese sus credenciales para continuar.</p>
          {sessionNotice ? <p className="mt-3 text-xs text-amber-200">{sessionNotice}</p> : null}
          {authReason ? (
            <p className="mt-1 text-[10px] text-[#9CA3AF]">
              Código de diagnóstico: <span className="font-mono">{authReason}</span>
              {redirectTo ? (
                <>
                  {' '}
                  · destino: <span className="font-mono">{redirectTo}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>

        <form method="POST" action="/api/auth/login" className="space-y-6">
          {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold tracking-wider text-[#C1C7D2] uppercase"
            >
              Email Institucional
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

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-wider text-[#C1C7D2] uppercase"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                strokeWidth={1.5}
              />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
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
          </div>

          <LoginSubmitButton />

          <div className="mt-6 space-y-2 text-center">
            <Link
              href="/auth/forgot-password"
              className="block text-sm text-[#C1C7D2] transition-colors hover:text-white"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Link
              href="/login?logout=1"
              className="block text-sm text-[#C1C7D2] transition-colors hover:text-white"
            >
              Cerrar sesión e iniciar con otra cuenta
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          PORTAL EXCLUSIVO PARA EQUIPO INTERNO UNIVERSITAS
        </p>
      </div>
    </div>
  )
}
