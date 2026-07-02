import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { forgotPasswordAction, resetPasswordAction } from '@/app/actions/auth'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('forgotPasswordAction', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('valida correo vacío', async () => {
    const formData = new FormData()
    const result = await forgotPasswordAction(null, formData)
    expect(result.error).toContain('correo')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('envía solicitud al backend', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Correo enviado' }),
    })

    const formData = new FormData()
    formData.set('email', 'curador@universitas.edu')

    const result = await forgotPasswordAction(null, formData)

    expect(result.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, options] = fetchMock.mock.calls[0]
    expect(String(url)).toContain('/auth/forgot-password')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ email: 'curador@universitas.edu' })
  })
})

describe('resetPasswordAction', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rechaza token vacío', async () => {
    const formData = new FormData()
    formData.set('newPassword', 'Abcdef1!')
    formData.set('confirmPassword', 'Abcdef1!')

    const result = await resetPasswordAction(null, formData)
    expect(result.error).toContain('enlace')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('restablece contraseña con token válido', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Contraseña actualizada' }),
    })

    const formData = new FormData()
    formData.set('token', 'reset-token-123')
    formData.set('newPassword', 'Abcdef1!')
    formData.set('confirmPassword', 'Abcdef1!')

    const result = await resetPasswordAction(null, formData)

    expect(result.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledOnce()
    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer reset-token-123')
    expect(JSON.parse(options.body)).toEqual({
      newPassword: 'Abcdef1!',
    })
  })

  it('informa enlace expirado', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Token inválido' }),
    })

    const formData = new FormData()
    formData.set('token', 'expired')
    formData.set('newPassword', 'Abcdef1!')
    formData.set('confirmPassword', 'Abcdef1!')

    const result = await resetPasswordAction(null, formData)
    expect(result.error).toContain('expiró')
  })
})
