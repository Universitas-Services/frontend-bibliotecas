import type { NotaInterna } from '@/app/actions/notas-internas'

type RevisionHistoryProps = {
  notas: NotaInterna[]
}

function getAutorLabel(nota: NotaInterna): string {
  return nota.autorNombre || nota.autor || 'Administrador'
}

function getAutorInitials(nota: NotaInterna): string {
  const name = getAutorLabel(nota)
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'AD'
}

function formatFecha(fecha?: string): string {
  if (!fecha) return 'Sin fecha'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RevisionHistory({ notas }: RevisionHistoryProps) {
  const sortedNotas = [...notas].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.fecha || 0).getTime()
    const dateB = new Date(b.createdAt || b.fecha || 0).getTime()
    return dateB - dateA
  })

  return (
    <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 shadow-sm">
      <h3 className="mb-6 text-[18px] font-bold text-[#0F1D30]">Historial de revisión</h3>

      {sortedNotas.length === 0 ? (
        <p className="text-sm text-[#6B7280]">No hay notas de revisión para este documento.</p>
      ) : (
        <div className="relative ml-2 space-y-8 border-l-2 border-[#E5E7EB] pb-4 pl-5">
          {sortedNotas.map((nota) => (
            <div key={nota.id} className="relative">
              <div className="absolute top-0 -left-[33px] flex h-7 w-7 items-center justify-center rounded-full bg-[#005496] text-[11px] font-bold text-white ring-4 ring-[#F9FAFB]">
                {getAutorInitials(nota)}
              </div>
              <div className="pl-4">
                <div className="mb-0.5 flex items-center justify-between gap-4">
                  <span className="text-[14px] font-bold text-[#0F1D30]">
                    {getAutorLabel(nota)}
                  </span>
                  <span className="shrink-0 text-[11px] font-bold text-[#6B7280]">
                    {formatFecha(nota.createdAt || nota.fecha)}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed font-medium text-[#6B7280]">
                  {nota.contenido}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
