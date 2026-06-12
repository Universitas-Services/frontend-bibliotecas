import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type CuradorPreviewActionsProps = {
  children: ReactNode
  className?: string
}

export function CuradorPreviewActions({ children, className }: CuradorPreviewActionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-end gap-3', className)}>{children}</div>
  )
}
