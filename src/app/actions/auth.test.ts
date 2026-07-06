import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_API_BASE_URL } from '@/lib/api'

const cookiesMock = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

const redirectMock = vi.fn(() => {
  throw new Error('NEXT_REDIRECT')
})

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookiesMock),
}))

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

describe('logoutAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: 'Sesión finalizada correctamente' }), {
            status: 201,
          }),
      ),
    )
    cookiesMock.get.mockReturnValue({ value: 'test-token' })
  })

  it('calls backend logout, deletes cookie and redirects', async () => {
    const { logoutAction } = await import('@/app/actions/auth')

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${DEFAULT_API_BASE_URL}/auth/logout`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    )
    expect(cookiesMock.delete).toHaveBeenCalledWith('access_token')
    expect(cookiesMock.delete).toHaveBeenCalledWith('refresh_token')
    expect(redirectMock).toHaveBeenCalledWith('/login')
  })

  it('still clears session when backend fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new Error('network'))),
    )

    const { logoutAction } = await import('@/app/actions/auth')

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT')

    expect(cookiesMock.delete).toHaveBeenCalledWith('access_token')
    expect(cookiesMock.delete).toHaveBeenCalledWith('refresh_token')
    expect(redirectMock).toHaveBeenCalledWith('/login')
  })
})
