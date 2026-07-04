import { describe, expect, it } from 'vitest'

import {
  isWorkflowEstado,
  mapBackendStatus,
  mapDocumentStatus,
  resolveDocumentWorkflowEstado,
} from '@/lib/document-status'

describe('isWorkflowEstado', () => {
  it('reconoce estados del workflow CMS', () => {
    expect(isWorkflowEstado('PENDIENTE_REVISION')).toBe(true)
    expect(isWorkflowEstado('BORRADOR')).toBe(true)
    expect(isWorkflowEstado('PUBLICADO')).toBe(true)
    expect(isWorkflowEstado('RECHAZADO')).toBe(true)
  })

  it('rechaza nombres geográficos', () => {
    expect(isWorkflowEstado('Lara')).toBe(false)
    expect(isWorkflowEstado('Miranda')).toBe(false)
  })
})

describe('resolveDocumentWorkflowEstado', () => {
  it('detecta colisión geográfica y asume PENDIENTE_REVISION', () => {
    const estado = resolveDocumentWorkflowEstado({
      estado: 'Lara',
      metadatos: { estado: 'Lara', municipio: 'Palavecino' },
    })

    expect(estado).toBe('PENDIENTE_REVISION')
  })

  it('prioriza estadoGeografico al detectar colisión legacy', () => {
    const estado = resolveDocumentWorkflowEstado({
      estado: 'Miranda',
      metadatos: { estadoGeografico: 'Miranda' },
    })

    expect(estado).toBe('PENDIENTE_REVISION')
  })

  it('respeta workflow real cuando no hay colisión', () => {
    expect(
      resolveDocumentWorkflowEstado({
        estado: 'BORRADOR',
        metadatos: { estadoGeografico: 'Lara' },
      }),
    ).toBe('BORRADOR')
  })
})

describe('mapBackendStatus', () => {
  it('no mapea valores geográficos a borrador', () => {
    expect(mapBackendStatus('Lara')).toBe('en-revision')
  })

  it('mapea PENDIENTE_REVISION a en-revision', () => {
    expect(mapBackendStatus('PENDIENTE_REVISION')).toBe('en-revision')
  })
})

describe('mapDocumentStatus', () => {
  it('ordena municipal en revisión aunque GET devuelva Lara', () => {
    expect(
      mapDocumentStatus({
        estado: 'Lara',
        metadatos: { estadoGeografico: 'Lara' },
      }),
    ).toBe('en-revision')
  })
})
