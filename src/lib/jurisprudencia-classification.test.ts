import { describe, expect, it } from 'vitest'

import {
  getJurisprudenciaNacionalBranchOptions,
  isJurisprudenciaDocumentType,
  isNacionalCarpetaName,
  isVirtualJurisprudenciaRamaId,
  needsJurisprudenciaNacionalSubrama,
} from '@/lib/jurisprudencia-classification'
import { resolveMetadataSchemaKey } from '@/lib/metadata-schemas'

describe('jurisprudencia-classification', () => {
  it('detecta jurisprudencia y rama nacional pendiente', () => {
    expect(isJurisprudenciaDocumentType('Jurisprudencia')).toBe(true)
    expect(isNacionalCarpetaName('Nacional')).toBe(true)
    expect(needsJurisprudenciaNacionalSubrama('Jurisprudencia', ['Nacional'])).toBe(true)
    expect(needsJurisprudenciaNacionalSubrama('Jurisprudencia', ['Internacional'])).toBe(false)
  })

  it('expone las tres ramas bajo nacional', () => {
    const options = getJurisprudenciaNacionalBranchOptions()
    expect(options).toHaveLength(3)
    expect(options.map((option) => option.nombreCarpeta)).toEqual([
      'Tribunal Supremo de Justicia',
      'Cortes Contencioso Administrativas',
      'Tribunales',
    ])
    expect(isVirtualJurisprudenciaRamaId(options[0]?.id ?? '')).toBe(true)
  })

  it('resuelve esquema al elegir rama virtual bajo nacional', () => {
    expect(
      resolveMetadataSchemaKey('Jurisprudencia', ['Nacional', 'Tribunal Supremo de Justicia']),
    ).toBe('jurisprudencia-tsj')
    expect(resolveMetadataSchemaKey('Jurisprudencia', ['Nacional', 'Tribunales'])).toBe(
      'jurisprudencia-tribunales',
    )
  })
})
