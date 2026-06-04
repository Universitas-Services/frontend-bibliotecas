import { describe, expect, it } from 'vitest'

import { buildOutboundFormData, getApiErrorMessage, normalizeDocumentsList } from '@/lib/api-client'

describe('api-client helpers', () => {
  it('extracts message from backend error body', () => {
    expect(getApiErrorMessage({ message: 'Token inválido' }, 'fallback')).toBe('Token inválido')
    expect(getApiErrorMessage({ error: 'Forbidden' }, 'fallback')).toBe('Forbidden')
  })

  it('prefers NestJS validation messages over generic Bad Request', () => {
    expect(
      getApiErrorMessage(
        {
          message: ['titulo no debe estar vacío', 'fechaPublicacion debe ser una fecha'],
          error: 'Bad Request',
          statusCode: 400,
        },
        'fallback',
      ),
    ).toBe('titulo no debe estar vacío fechaPublicacion debe ser una fecha')
  })

  it('uses fallback when body has no message', () => {
    expect(getApiErrorMessage({}, 'Error genérico')).toBe('Error genérico')
  })

  it('normalizes a plain array response', () => {
    const docs = [{ id: '1', titulo: 'A' }]
    expect(normalizeDocumentsList(docs)).toEqual(docs)
  })

  it('normalizes paginated wrappers', () => {
    const docs = [{ id: '2', titulo: 'B' }]
    expect(normalizeDocumentsList({ data: docs })).toEqual(docs)
    expect(normalizeDocumentsList({ content: docs })).toEqual(docs)
    expect(normalizeDocumentsList({ documentos: docs })).toEqual(docs)
  })

  it('returns empty array for unknown shapes', () => {
    expect(normalizeDocumentsList(null)).toEqual([])
    expect(normalizeDocumentsList({ total: 0 })).toEqual([])
  })

  it('rebuilds multipart with file name for outbound upload', () => {
    const source = new FormData()
    const file = new File(['pdf'], 'test.pdf', { type: 'application/pdf' })
    source.append('file', file)
    source.append('titulo', 'Ley ejemplo')

    const outbound = buildOutboundFormData(source)
    const outboundFile = outbound.get('file')

    expect(outbound.get('titulo')).toBe('Ley ejemplo')
    expect(outboundFile).toBeInstanceOf(File)
    expect((outboundFile as File).name).toBe('test.pdf')
  })
})
