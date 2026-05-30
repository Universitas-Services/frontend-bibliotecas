import type { AdminUser, AssignableRole, MatrizItem, TemaPrincipal } from '@/lib/types/admin'

const temasPrincipales: TemaPrincipal[] = [
  { id: 'propiedad-intelectual', nombre: 'Propiedad Intelectual' },
  { id: 'normativa-digital', nombre: 'Normativa Digital' },
]

const users: AdminUser[] = [
  {
    id: 'user-mock-1',
    nombre: 'Ana',
    apellido: 'Gómez',
    email: 'ana.gomez@universitas.edu',
    rol: 'CURADOR',
    createdAt: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'user-mock-2',
    nombre: 'Carlos',
    apellido: 'Méndez',
    email: 'carlos.mendez@universitas.edu',
    rol: 'REVISOR',
    temaPrincipalId: 'propiedad-intelectual',
    createdAt: new Date('2025-02-15').toISOString(),
  },
]

const matrizA: MatrizItem[] = [
  {
    id: 'mat-a-1',
    nombre: 'Módulo de Integridad Académica',
    fileName: 'matriz-formacion-v4.2.xlsx',
    version: 'v4.2',
    uploadedAt: new Date('2025-03-01').toISOString(),
  },
]

const matrizB: MatrizItem[] = [
  {
    id: 'mat-b-1',
    nombre: 'Artículo Ágora — Ética profesional',
    fileName: 'agora-articulos-q1.csv',
    version: 'Q1-2025',
    uploadedAt: new Date('2025-03-05').toISOString(),
  },
]

export function getTemasPrincipales(): TemaPrincipal[] {
  return [...temasPrincipales]
}

export function getTemaPrincipalById(id: string): TemaPrincipal | undefined {
  return temasPrincipales.find((t) => t.id === id)
}

export function listUsers(): AdminUser[] {
  return [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function createUser(
  data: Omit<AdminUser, 'id' | 'createdAt'> & { password?: string },
): AdminUser {
  const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())
  if (exists) {
    throw new Error('Ya existe un usuario con ese correo electrónico.')
  }

  const user: AdminUser = {
    id: `user-${crypto.randomUUID()}`,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    rol: data.rol,
    temaPrincipalId: data.temaPrincipalId,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  return user
}

export function addMatrizAItem(fileName: string): MatrizItem {
  const item: MatrizItem = {
    id: `mat-a-${crypto.randomUUID()}`,
    nombre: fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    fileName,
    uploadedAt: new Date().toISOString(),
  }
  matrizA.unshift(item)
  return item
}

export function addMatrizBItem(fileName: string): MatrizItem {
  const item: MatrizItem = {
    id: `mat-b-${crypto.randomUUID()}`,
    nombre: fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    fileName,
    uploadedAt: new Date().toISOString(),
  }
  matrizB.unshift(item)
  return item
}

export function listMatrizA(): MatrizItem[] {
  return [...matrizA]
}

export function listMatrizB(): MatrizItem[] {
  return [...matrizB]
}

export const ROLE_LABELS: Record<AssignableRole, string> = {
  CURADOR: 'Curador',
  REVISOR: 'Revisor',
  AUDITOR: 'Auditor',
}
