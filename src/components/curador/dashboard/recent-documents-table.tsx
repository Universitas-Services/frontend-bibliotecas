import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

import { DocumentActions } from '@/components/curador/document-actions'
import { DOCUMENT_STATUS_STYLES } from '@/lib/document-status'
import type { DashboardDocument } from '@/lib/curador-dashboard'

type RecentDocumentsTableProps = {
  documents: DashboardDocument[]
}

export function RecentDocumentsTable({ documents }: RecentDocumentsTableProps) {
  return (
    <Card className="mt-6 border-[#C1C7D2] shadow-sm">
      <CardHeader className="flex flex-col justify-between gap-4 rounded-t-xl border-b border-[#E5E7EB] bg-[#F9FAFB] pb-4 sm:flex-row sm:items-center">
        <CardTitle className="text-xl font-bold text-[#0F1D30]">Mis Documentos Recientes</CardTitle>
        <Button
          variant="outline"
          className="h-9 border-[#C1C7D2] font-semibold text-[#404551]"
          asChild
        >
          <Link href="/curador/gestion-documental">Ver todos</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B7280]">
            Aún no hay documentos cargados.{' '}
            <Link
              href="/curador/nueva-carga"
              className="font-semibold text-[#005496] hover:underline"
            >
              Cargar nuevo documento
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#F9FAFB]">
              <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                <TableHead className="text-xs font-bold tracking-wider text-[#6B7280] uppercase">
                  Documento
                </TableHead>
                <TableHead className="text-xs font-bold tracking-wider text-[#6B7280] uppercase">
                  Fecha
                </TableHead>
                <TableHead className="text-xs font-bold tracking-wider text-[#6B7280] uppercase">
                  Estado
                </TableHead>
                <TableHead className="text-right text-xs font-bold tracking-wider text-[#6B7280] uppercase">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const styles = DOCUMENT_STATUS_STYLES[doc.status]
                return (
                  <TableRow key={doc.id} className="border-[#E5E7EB]">
                    <TableCell>
                      <div className="font-semibold text-[#0F1D30]">{doc.title}</div>
                      <div className="text-xs text-[#6B7280]">{doc.subtitle}</div>
                    </TableCell>
                    <TableCell className="text-sm text-[#404551]">{doc.fecha}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${styles.badgeBg} ${styles.badgeText} text-[10px] font-bold uppercase`}
                      >
                        {styles.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DocumentActions documentId={doc.id} status={doc.status} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
