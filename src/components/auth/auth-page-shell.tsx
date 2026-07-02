import type { ReactNode } from 'react'

type AuthPageShellProps = {
  children: ReactNode
  maxWidthClassName?: string
}

export function AuthPageShell({
  children,
  maxWidthClassName = 'max-w-[400px]',
}: AuthPageShellProps) {
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#F8FAFC] px-4">
      <div className="mb-8 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/LOGO UNIVERSITAS LEGAL.png"
          alt="Universitas Legal"
          className="h-28 w-auto object-contain brightness-0 drop-shadow-md invert"
        />
      </div>

      <div className={`w-full ${maxWidthClassName}`}>{children}</div>

      <div className="mt-12 text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Portal exclusivo para equipo interno Universitas
        </p>
      </div>
    </div>
  )
}
