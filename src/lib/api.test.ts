import { afterEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_API_BASE_URL, getApiBaseUrl } from '@/lib/api'

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses API_BASE_URL when defined', () => {
    vi.stubEnv('API_BASE_URL', 'http://localhost:4000/')
    expect(getApiBaseUrl()).toBe('http://localhost:4000')
  })

  it('falls back to default production URL when unset', () => {
    delete process.env.API_BASE_URL
    expect(getApiBaseUrl()).toBe(DEFAULT_API_BASE_URL)
  })
})
