/** Catálogos territoriales gestionados en frontend (sin API backend). */

export const VENEZUELA_ESTADOS = [
  'Amazonas',
  'Anzoátegui',
  'Apure',
  'Aragua',
  'Barinas',
  'Bolívar',
  'Carabobo',
  'Cojedes',
  'Delta Amacuro',
  'Distrito Capital',
  'Falcón',
  'Guárico',
  'La Guaira',
  'Lara',
  'Mérida',
  'Miranda',
  'Monagas',
  'Nueva Esparta',
  'Portuguesa',
  'Sucre',
  'Táchira',
  'Trujillo',
  'Yaracuy',
  'Zulia',
] as const

/** Municipios representativos por estado (lista parcial — ampliar según necesidad). */
export const MUNICIPIOS_POR_ESTADO: Record<string, string[]> = {
  Miranda: [
    'Baruta',
    'Carrizal',
    'Chacao',
    'El Hatillo',
    'Guaicaipuro',
    'Los Salias',
    'Plaza',
    'Sucre',
    'Zamora',
  ],
  'Distrito Capital': ['Libertador'],
  Zulia: ['Maracaibo', 'San Francisco', 'Cabimas'],
  Carabobo: ['Valencia', 'Guacara', 'Puerto Cabello'],
  Lara: ['Iribarren', 'Palavecino'],
  Mérida: ['Libertador'],
}

export function getMunicipiosForEstado(estado: string): string[] {
  return MUNICIPIOS_POR_ESTADO[estado] ?? []
}

export const TRIBUNALES_JURISPRUDENCIA = [
  'Tribunal Supremo de Justicia',
  'Corte Primera de lo Contencioso Administrativo',
  'Corte Segunda de lo Contencioso Administrativo',
  'Sala de Casación Social',
  'Sala Constitucional',
] as const

export const SALAS_TSJ = [
  'Sala Constitucional',
  'Sala Político-Administrativa',
  'Sala Electoral',
  'Sala de Casación Civil',
  'Sala de Casación Penal',
  'Sala de Casación Social',
  'Sala Plena',
] as const
