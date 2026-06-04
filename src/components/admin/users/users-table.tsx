'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROLE_LABELS } from '@/lib/mocks/admin-store'
import type { PaginatedUsersResponse } from '@/lib/types/admin'

type UsersTableProps = {
  data: PaginatedUsersResponse
}

export function UsersTable({ data }: UsersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentRole = searchParams.get('role') || 'TODOS'
  const currentPage = data.page

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'TODOS') {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams],
  )

  const handleRoleChange = (role: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (role !== 'TODOS') {
      params.set('role', role)
    } else {
      params.delete('role')
    }
    params.set('page', '1') // Reset to first page on filter
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString('page', newPage.toString())}`)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {data.total} usuario{data.total === 1 ? '' : 's'} registrado
            {data.total === 1 ? '' : 's'}
          </p>
          <div className="w-[180px]">
            <Select value={currentRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos los roles</SelectItem>
                <SelectItem value="CURADOR">Curador</SelectItem>
                <SelectItem value="REVISOR">Revisor</SelectItem>
                <SelectItem value="AUDITOR">Auditor</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button asChild className="bg-[#003D6F] hover:bg-[#00315C]">
          <Link href="/admin/usuarios/nuevo">Crear usuario</Link>
        </Button>
      </div>

      {data.items.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          No hay usuarios registrados con estos filtros.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Tema principal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((user) => {
                  const temas = user.temasPrincipales?.map((t) => t.nombre).join(', ') || '—'
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.nombre} {user.apellido}
                      </TableCell>
                      <TableCell>{user.correo}</TableCell>
                      <TableCell>{ROLE_LABELS[user.rol] || user.rol}</TableCell>
                      <TableCell className="text-gray-600">
                        {user.rol === 'REVISOR' || user.rol === 'CURADOR' ? temas : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Anterior
              </Button>
              <div className="text-sm text-slate-600">
                Página {currentPage} de {data.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= data.totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
