import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getTemaPrincipalById, ROLE_LABELS } from '@/lib/mocks/admin-store'
import type { AdminUser } from '@/lib/types/admin'

type UsersTableProps = {
  users: AdminUser[]
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          {users.length} usuario{users.length === 1 ? '' : 's'} registrado
          {users.length === 1 ? '' : 's'}
        </p>
        <Button asChild className="bg-[#003D6F] hover:bg-[#00315C]">
          <Link href="/admin/usuarios/nuevo">Crear usuario</Link>
        </Button>
      </div>

      {users.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          No hay usuarios registrados. Cree el primero con el botón superior.
        </p>
      ) : (
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
              {users.map((user) => {
                const tema = user.temaPrincipalId
                  ? getTemaPrincipalById(user.temaPrincipalId)
                  : undefined
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.nombre} {user.apellido}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{ROLE_LABELS[user.rol]}</TableCell>
                    <TableCell className="text-gray-600">
                      {user.rol === 'REVISOR' ? (tema?.nombre ?? '—') : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
