export type EstadoAprobacion = 'APROBADA' | 'SUGERIDA' | 'RECHAZADA'

export type SugeridoPor = {
  id: string
  email: string
  role: string
}

export type EtiquetaItem = {
  id: string
  nombre: string
  estado: EstadoAprobacion
  createdAt?: string
  updatedAt?: string
  sugeridoPorId?: string | null
}

export type CategoriaItem = {
  id: string
  nombre: string
  descripcion?: string
  estado?: EstadoAprobacion
  createdAt?: string
  updatedAt?: string
  sugeridoPorId?: string | null
}

export type SugerenciaPendiente = {
  id: string
  nombre: string
  estado: EstadoAprobacion
  sugeridoPorId?: string | null
  createdAt?: string
  updatedAt?: string
  sugeridoPor?: SugeridoPor | null
}
