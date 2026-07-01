import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_GLOBAL_API_BASE_URL,
  getEstados,
  getGlobalApiBaseUrl,
  getTribunalesEstadales,
  getTribunalesMunicipales,
} from '@/lib/global-universitas-client'

const mockGetEstados = vi.fn()
const mockGetMunicipios = vi.fn()

vi.mock('@universitas/sdk-global', () => ({
  UniversitasAPI: class MockUniversitasAPI {
    territorio = {
      getEstados: (...args: unknown[]) => mockGetEstados(...args),
      getMunicipios: (...args: unknown[]) => mockGetMunicipios(...args),
      getParroquias: vi.fn(),
      getCiudades: vi.fn(),
    }
  },
}))

describe('global-universitas-client', () => {
  beforeEach(() => {
    vi.stubEnv('GLOBAL_API_BASE_URL', 'https://global-api.test')
    mockGetEstados.mockReset()
    mockGetMunicipios.mockReset()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('resuelve la base URL desde GLOBAL_API_BASE_URL', async () => {
    vi.resetModules()
    const mod = await import('@/lib/global-universitas-client')
    expect(mod.getGlobalApiBaseUrl()).toBe('https://global-api.test')
  })

  it('usa NEXT_PUBLIC_API_URL cuando GLOBAL_API_BASE_URL no está definida', async () => {
    delete process.env.GLOBAL_API_BASE_URL
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://next-public-api.test')
    vi.resetModules()
    const mod = await import('@/lib/global-universitas-client')
    expect(mod.getGlobalApiBaseUrl()).toBe('https://next-public-api.test')
  })

  it('usa el default cuando no hay variable de entorno', async () => {
    delete process.env.GLOBAL_API_BASE_URL
    delete process.env.NEXT_PUBLIC_API_URL
    vi.resetModules()
    const mod = await import('@/lib/global-universitas-client')
    expect(mod.getGlobalApiBaseUrl()).toBe(DEFAULT_GLOBAL_API_BASE_URL)
  })

  it('delegates getEstados al SDK', async () => {
    mockGetEstados.mockResolvedValue({
      message: 'ok',
      data: [{ id: 1, nombre: 'Lara' }],
    })

    await expect(getEstados()).resolves.toEqual([{ id: 1, nombre: 'Lara' }])
    expect(mockGetEstados).toHaveBeenCalledOnce()
  })

  it('consulta tribunales estadales con fetch directo', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'ok',
        data: [{ id: 9, nombre: 'Corte de Apelaciones', categoria: 'Superior' }],
      }),
    } as Response)

    await expect(getTribunalesEstadales(13)).resolves.toEqual([
      { id: 9, nombre: 'Corte de Apelaciones', categoria: 'Superior' },
    ])

    expect(fetchMock).toHaveBeenCalledWith(
      `${getGlobalApiBaseUrl()}/api/v1/territorio/estados/13/tribunales`,
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('consulta tribunales municipales con fetch directo', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'ok',
        data: [{ id: 3, nombre: 'Tribunal Municipal', categoria: 'Municipio' }],
      }),
    } as Response)

    await expect(getTribunalesMunicipales(55)).resolves.toEqual([
      { id: 3, nombre: 'Tribunal Municipal', categoria: 'Municipio' },
    ])

    expect(fetchMock).toHaveBeenCalledWith(
      `${getGlobalApiBaseUrl()}/api/v1/territorio/municipios/55/tribunales`,
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })
})
