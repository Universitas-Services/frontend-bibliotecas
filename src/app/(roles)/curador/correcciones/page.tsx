import Link from 'next/link'

import { getDocumentosConNotasAction } from '@/app/actions/notas-internas'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatFecha(fecha?: string): string {
  if (!fecha) return '—'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function CorreccionesIndexPage() {
  const result = await getDocumentosConNotasAction()

  if (!result.success) {
    return (
      <div className="mx-auto max-w-[1400px] p-6 md:p-8">
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-12 text-center">
          <h3 className="text-sm font-bold text-[#93000A]">Error al cargar correcciones</h3>
          <p className="mt-2 text-sm text-[#6B7280]">{result.error}</p>
        </div>
      </div>
    )
  }

  const documentos = result.data

  return (
    <div className="animate-in fade-in mx-auto w-full max-w-[1400px] p-6 duration-500 md:p-8">
      <div className="mb-8">
        <h1 className="font-['Space_Grotesk'] text-[28px] font-bold tracking-tight text-[#00315C]">
          Correcciones pendientes
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Documentos con notas internas del equipo de revisión.
        </p>
      </div>

      {documentos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#C1C7D2] bg-[#F8FAFC] p-12 text-center">
          <h3 className="text-sm font-bold text-[#0F1D30]">Sin correcciones pendientes</h3>
          <p className="mt-1 text-sm text-[#6B7280]">
            No hay documentos con notas internas en este momento.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-[#F9FAFB]">
              <TableRow>
                <TableHead className="font-bold text-[#404551]">Título</TableHead>
                <TableHead className="font-bold text-[#404551]">Tema</TableHead>
                <TableHead className="text-center font-bold text-[#404551]">N° notas</TableHead>
                <TableHead className="font-bold text-[#404551]">Última nota</TableHead>
                <TableHead className="font-bold text-[#404551]">Autor</TableHead>
                <TableHead className="font-bold text-[#404551]">Fecha</TableHead>
                <TableHead className="text-right font-bold text-[#404551]">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-[#F9FAFB]">
                  <TableCell className="max-w-[240px] truncate font-medium text-[#0F1D30]">
                    {doc.titulo}
                  </TableCell>
                  <TableCell className="text-[#6B7280]">{doc.tema || '—'}</TableCell>
                  <TableCell className="text-center font-semibold text-[#005496]">
                    {doc.notasCount}
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate text-sm text-[#6B7280]">
                    {doc.ultimaNota || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-[#404551]">
                    {doc.autorUltimaNota || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-[#6B7280]">
                    {formatFecha(doc.fechaUltimaNota)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline" className="h-8">
                      <Link href={`/curador/correcciones/${doc.id}`}>Ver detalle</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
