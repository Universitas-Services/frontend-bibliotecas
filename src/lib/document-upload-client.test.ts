import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { uploadDocumentClient } from '@/lib/document-upload-client'

describe('document-upload-client', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('obtiene JWT y sube directo a Cloud Run sin Content-Type manual', async () => {
    const formData = new FormData()
    formData.append('file', new File(['pdf-content'], 'documento.pdf', { type: 'application/pdf' }))
    formData.append('tituloIntegro', 'Ley de prueba')

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'jwt-test',
          baseUrl: 'https://backend.test',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'doc-1' }),
      })

    const result = await uploadDocumentClient(formData)

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ id: 'doc-1' })
    expect(fetchMock).toHaveBeenCalledTimes(2)

    expect(fetchMock.mock.calls[0][0]).toBe('/api/documentos/upload-auth')

    const uploadCall = fetchMock.mock.calls[1]
    expect(uploadCall[0]).toBe('https://backend.test/documentos/upload')
    expect(uploadCall[1]).toMatchObject({
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-test',
        Accept: 'application/json',
      },
      body: formData,
    })
    expect(uploadCall[1].headers).not.toHaveProperty('Content-Type')
  })

  it('rechaza archivos que superan 32 MB antes de llamar al backend', async () => {
    const formData = new FormData()
    const largeFile = new File(['x'], 'grande.pdf', { type: 'application/pdf' })
    Object.defineProperty(largeFile, 'size', { value: 33 * 1024 * 1024 })
    formData.append('file', largeFile)

    const result = await uploadDocumentClient(formData)

    expect(result.success).toBeUndefined()
    expect(result.status).toBe(413)
    expect(result.error).toContain('32 MB')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('propaga error de sesión desde upload-auth', async () => {
    const formData = new FormData()
    formData.append('file', new File(['x'], 'doc.pdf', { type: 'application/pdf' }))

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Sesión expirada', code: 'TOKEN_EXPIRED' }),
    })

    const result = await uploadDocumentClient(formData)

    expect(result.status).toBe(401)
    expect(result.error).toBe('Sesión expirada')
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
