'use client'

import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type FormComboboxProps = {
  id: string
  label: string
  hint?: string
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function FormCombobox({
  id,
  label,
  hint,
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  disabled,
  invalid,
  className,
}: FormComboboxProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-bold text-[#00315C]">
        {label}
      </Label>
      {hint ? <p className="text-xs text-gray-500 italic">{hint}</p> : null}
      <Combobox
        id={id}
        options={options}
        value={value}
        onValueChange={onValueChange}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        disabled={disabled}
        aria-invalid={invalid}
      />
    </div>
  )
}
