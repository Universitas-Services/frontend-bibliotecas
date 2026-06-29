import { describe, expect, it } from 'vitest'

import {
  mapCarpetasFromApi,
  normalizeCarpetaInterna,
  normalizeCarpetasList,
} from '@/lib/temas-taxonomy'

describe('normalizeCarpetasList', () => {
  it('parsea array plano', () => {
    const data = [{ id: '1', nombreCarpeta: 'Ensayos' }]
    expect(normalizeCarpetasList(data)).toHaveLength(1)
  })

  it('parsea envoltorio hijos', () => {
    const data = {
      hijos: [
        { id: 'child-1', nombreCarpeta: 'Subcarpeta A' },
        { id: 'child-2', nombreCarpeta: 'Subcarpeta B' },
      ],
    }
    expect(mapCarpetasFromApi(data)).toHaveLength(2)
  })

  it('parsea envoltorio data anidado', () => {
    const data = {
      data: {
        hijos: [{ carpetaInternaId: 'x-1', nombre: 'Nivel 4' }],
      },
    }
    const carpetas = mapCarpetasFromApi(data)
    expect(carpetas).toHaveLength(1)
    expect(carpetas[0]?.id).toBe('x-1')
    expect(carpetas[0]?.nombreCarpeta).toBe('Nivel 4')
  })

  it('conserva hijos embebidos en cada carpeta', () => {
    const carpeta = normalizeCarpetaInterna({
      id: 'parent',
      nombreCarpeta: 'Ensayos',
      children: [{ id: 'child', nombreCarpeta: 'Tesis' }],
    })

    expect(carpeta.children).toHaveLength(1)
    expect(carpeta.children?.[0]?.nombreCarpeta).toBe('Tesis')
  })
})
