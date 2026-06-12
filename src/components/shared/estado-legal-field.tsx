import { ESTADO_LEGAL_OPTIONS } from '@/lib/document-status'

type EstadoLegalFieldProps = {
  name?: string
  defaultValue?: string
  className?: string
  label?: string
  description?: string
}

export function EstadoLegalField({
  name = 'estadoLegal',
  defaultValue,
  className,
  label = 'Estado legal',
  description = 'Clasificación jurídica del instrumento. Opcional al cargar; una vez asignado no puede volver a «sin clasificar».',
}: EstadoLegalFieldProps) {
  const normalizedDefault = defaultValue?.trim().toUpperCase() || ''

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-[#00315C]">
        {label}
      </label>
      {description ? <p className="mb-3 text-sm text-slate-500">{description}</p> : null}
      <select
        id={name}
        name={name}
        defaultValue={normalizedDefault}
        className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]"
      >
        <option value="">Sin clasificar</option>
        {ESTADO_LEGAL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
