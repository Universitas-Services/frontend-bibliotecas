import type { NotaInterna } from '@/app/actions/notas-internas'

type RequiredCorrectionsProps = {
  notas: NotaInterna[]
}

function getAutorLabel(nota: NotaInterna): string {
  return nota.autorNombre || nota.autor || 'Administrador'
}

function formatFecha(fecha?: string): string {
  if (!fecha) return ''
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function RequiredCorrections({ notas }: RequiredCorrectionsProps) {
  return (
    <div className="flex h-full flex-col rounded-r-xl border-l-[3px] border-[#D97706] bg-[#2A2F3A] p-6 shadow-md">
      <h3 className="mb-6 text-[10px] font-bold tracking-wider text-[#C1C7D2] uppercase">
        CORRECCIONES REQUERIDAS
      </h3>

      {notas.length === 0 ? (
        <p className="text-sm text-[#9CA3AF]">No hay correcciones pendientes.</p>
      ) : (
        <div className="flex-1 space-y-5">
          {notas.map((nota) => (
            <div key={nota.id} className="rounded-md border border-[#404551] bg-[#1F2430] p-4">
              <p className="text-[13px] leading-snug font-medium text-[#D4E4FA]">
                {nota.contenido}
              </p>
              <p className="mt-2 text-[11px] font-semibold text-[#9CA3AF]">
                {getAutorLabel(nota)}
                {(nota.createdAt || nota.fecha) && (
                  <> · {formatFecha(nota.createdAt || nota.fecha)}</>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
