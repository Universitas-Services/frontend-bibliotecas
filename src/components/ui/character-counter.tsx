import { cn } from '@/lib/utils'

type CharacterCounterProps = {
  current: number
  max: number
  className?: string
}

export function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const ratio = current / max
  const isWarning = ratio >= 0.9 && current < max
  const isOver = current >= max

  return (
    <span
      className={cn(
        'text-xs font-medium tabular-nums',
        isOver ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-500',
        className,
      )}
    >
      {current} / {max}
    </span>
  )
}
