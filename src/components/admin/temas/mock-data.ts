export type Especialista = {
  id: string
  nombre: string
  certificacionNivel2: boolean
}

export type TemaPrincipal = {
  id: string
  nombre: string
  revisoresAsignados: Especialista[]
  activo: boolean
}

export const MOCK_ESPECIALISTAS: Especialista[] = [
  { id: 'e1', nombre: 'Dr. Marco Antonio Ruiz', certificacionNivel2: true },
  { id: 'e2', nombre: 'Dra. Luciana García', certificacionNivel2: false },
  { id: 'e3', nombre: 'Mtra. Sofía Mendez', certificacionNivel2: true },
  { id: 'e4', nombre: 'Dr. Roberto Valdés', certificacionNivel2: true },
  { id: 'e5', nombre: 'Lic. Carlos Santana', certificacionNivel2: false },
]

export const MOCK_TEMAS: TemaPrincipal[] = [
  {
    id: 't1',
    nombre: 'Acción de tutelas',
    revisoresAsignados: [MOCK_ESPECIALISTAS[0]!, MOCK_ESPECIALISTAS[1]!], // Revisor 1, Revisor 2 mock
    activo: true,
  },
  {
    id: 't2',
    nombre: 'Caducidad administrativa',
    revisoresAsignados: [],
    activo: true,
  },
  {
    id: 't3',
    nombre: 'Derecho Penal Económico',
    revisoresAsignados: [MOCK_ESPECIALISTAS[3]!],
    activo: false,
  },
]
