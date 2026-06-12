import { describe, expect, it, vi } from 'vitest'

const redirectMock = vi.fn(() => {
  throw new Error('NEXT_REDIRECT')
})

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

describe('Home page', () => {
  it('redirects to login', async () => {
    const Home = (await import('@/app/page')).default

    expect(() => Home()).toThrow('NEXT_REDIRECT')
    expect(redirectMock).toHaveBeenCalledWith('/login')
  })
})
