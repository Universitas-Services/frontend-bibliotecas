'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'

const initialState = {
  error: null as string | null,
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state?.error])

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
        </div>

        <form action={formAction} className="space-y-6">
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
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="h-12 border-none bg-[#050810] pl-11 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#005496]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-[#005496] text-white transition-colors hover:bg-[#003D6F]"
          >
            {isPending ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
            {!isPending && <ArrowRight className="h-5 w-5" />}
          </Button>

          <div className="mt-6 space-y-2 text-center">
            <a href="#" className="block text-sm text-[#C1C7D2] transition-colors hover:text-white">
              ¿Olvidaste tu contraseña?
            </a>
            <a
              href="/login?logout=1"
              className="block text-sm text-[#C1C7D2] transition-colors hover:text-white"
            >
              Cerrar sesión e iniciar con otra cuenta
            </a>
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
