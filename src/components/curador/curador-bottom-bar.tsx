import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type CuradorBottomBarProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
  /** fixed = pegada al viewport; inline = al final del contenido del formulario */
  variant?: 'fixed' | 'inline'
}

export function CuradorBottomBar({
  children,
  className,
  innerClassName,
  variant = 'fixed',
}: CuradorBottomBarProps) {
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-6',
          className,
          innerClassName,
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white/95 backdrop-blur-sm md:left-[16rem] md:w-[calc(100%-16rem)]',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1600px] items-center justify-end gap-3 px-6 py-4 md:px-8',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
