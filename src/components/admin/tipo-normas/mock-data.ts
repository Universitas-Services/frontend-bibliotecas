export type InstrumentoLegal = {
  id: string
  nombre: string
  descripcion: string
  activo: boolean
}

export const MOCK_INSTRUMENTOS: InstrumentoLegal[] = [
  {
    id: 'i1',
    nombre: 'Ley',
    descripcion: 'Norma jurídica dictada por el legislador, a la cual todos deben obediencia.',
    activo: true,
  },
  {
    id: 'i2',
    nombre: 'Ordenanza',
    descripcion: 'Disposición o mandato que tiene carácter de ley a nivel municipal o regional.',
    activo: true,
  },
  {
    id: 'i3',
    nombre: 'Sentencias',
    descripcion: 'Resolución de un juez o un tribunal que pone fin a un litigio o causa penal.',
    activo: true,
  },
  {
    id: 'i4',
    nombre: 'Providencia',
    descripcion: 'Resolución judicial que no requiere fundamentación para trámites de orden.',
    activo: true,
  },
  {
    id: 'i5',
    nombre: 'Decreto',
    descripcion: 'Decisión de una autoridad sobre la materia en que tiene competencia.',
    activo: true,
  },
]
