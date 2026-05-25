'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, ArrowRight, Hexagon } from 'lucide-react'
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
      {/* Logo temporal */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center bg-[#404551]">
          {/* Cuadrado oscuro superior del logo */}
        </div>
        <Hexagon className="h-16 w-16 text-[#005496]" strokeWidth={1.5} />
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
            <label className="text-xs font-semibold tracking-wider text-[#C1C7D2] uppercase">
              Email Institucional
            </label>
            <div className="relative">
              <Mail
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                strokeWidth={1.5}
              />
              <Input
                name="email"
                type="email"
                placeholder="usuario@universitas.edu"
                required
                className="h-12 border-none bg-[#050810] pl-11 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#005496]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-[#C1C7D2] uppercase">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                strokeWidth={1.5}
              />
              <Input
                name="password"
                type="password"
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
