import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Filter, Eye, Pencil } from 'lucide-react'

const documents = [
  {
    id: 'DOC-2023-001',
    title: 'Reforma Código Civil Art. 42',
    rama: 'Derecho Civil',
    fecha: '24/10/2023',
    status: 'Publicado',
    statusColor: 'bg-[#DCFCE7] text-[#16A34A]',
    dotColor: 'bg-[#16A34A]',
  },
  {
    id: 'DOC-2023-089',
    title: 'Sentencia T-123/23 Corte Const.',
    rama: 'Derecho Laboral',
    fecha: '23/10/2023',
    status: 'Devuelto',
    statusColor: 'bg-[#FEE2E2] text-[#93000A]',
    dotColor: 'bg-[#93000A]',
  },
  {
    id: 'DOC-2023-142',
    title: 'Proyecto Ley de Tierras 2024',
    rama: 'Derecho Agrario',
    fecha: '22/10/2023',
    status: 'En Revisión',
    statusColor: 'bg-[#D4E4FA] text-[#005496]',
    dotColor: 'bg-[#005496]',
  },
  {
    id: 'DOC-2023-012',
    title: 'Decreto Presidencial 005-23',
    rama: 'Derecho Público',
    fecha: '21/10/2023',
    status: 'Rechazado',
    statusColor: 'bg-[#E5E7EB] text-[#404551]',
    dotColor: 'bg-[#404551]',
  },
]

export function RecentDocumentsTable() {
  return (
    <Card className="mt-6 border-[#C1C7D2] shadow-sm">
      <CardHeader className="flex flex-col justify-between gap-4 rounded-t-xl border-b border-[#E5E7EB] bg-[#F9FAFB] pb-4 sm:flex-row sm:items-center">
        <CardTitle className="text-xl font-bold text-[#0F1D30]">Mis Documentos Recientes</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-[#6B7280]" />
            <Input
              placeholder="Buscar documento..."
              className="h-9 w-[260px] border-[#C1C7D2] bg-white pl-10 text-sm focus-visible:ring-[#005496]"
            />
          </div>
          <Button
            variant="outline"
            className="h-9 gap-2 border-[#C1C7D2] font-semibold text-[#404551]"
          >
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="border-[#E5E7EB] hover:bg-transparent">
              <TableHead className="h-11 w-[35%] px-6 text-xs font-bold text-[#6B7280]">
                TÍTULO BREVE
              </TableHead>
              <TableHead className="h-11 text-xs font-bold text-[#6B7280]">
                RAMA DEL DERECHO
              </TableHead>
              <TableHead className="h-11 text-xs font-bold text-[#6B7280]">FECHA CARGA</TableHead>
              <TableHead className="h-11 text-xs font-bold text-[#6B7280]">ESTADO</TableHead>
              <TableHead className="h-11 px-6 text-right text-xs font-bold text-[#6B7280]">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow
                key={doc.id}
                className="border-[#E5E7EB] transition-colors hover:bg-[#FAFAFA]"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-bold text-[#0F1D30]">{doc.title}</span>
                    <span className="text-[12px] font-bold tracking-wide text-[#6B7280] uppercase">
                      {doc.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-[#404551]">{doc.rama}</TableCell>
                <TableCell className="font-medium text-[#404551]">{doc.fecha}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`rounded-full border-transparent px-2.5 py-0.5 font-semibold hover:bg-transparent ${doc.statusColor}`}
                  >
                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${doc.dotColor}`}></span>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <div className="flex justify-end gap-3 text-[#005496]">
                    <button className="transition-colors hover:text-[#0F1D30]">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="transition-colors hover:text-[#0F1D30]">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between rounded-b-xl border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4">
          <p className="text-[13px] font-semibold text-[#6B7280]">
            Mostrando 4 de 1,248 documentos
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-[#C1C7D2] bg-white font-semibold text-[#6B7280] hover:bg-gray-50"
              disabled
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-[#C1C7D2] bg-white font-bold text-[#005496] hover:bg-blue-50"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
