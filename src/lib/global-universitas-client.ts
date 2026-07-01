import {
  UniversitasAPI,
  type Estado,
  type GenericResponse,
  type Municipio,
  type Parroquia,
} from '@universitas/sdk-global'

export type Tribunal = {
  id: number
  nombre: string
  categoria: string
}

export const DEFAULT_GLOBAL_API_BASE_URL =
  'https://api-global-universitas-693924722323.us-central1.run.app'

export function getGlobalApiBaseUrl(): string {
  const url =
    process.env.GLOBAL_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    DEFAULT_GLOBAL_API_BASE_URL
  return url.replace(/\/$/, '')
}

let apiInstance: UniversitasAPI | null = null

export function getGlobalUniversitasApi(): UniversitasAPI {
  if (!apiInstance) {
    apiInstance = new UniversitasAPI(getGlobalApiBaseUrl())
  }
  return apiInstance
}

async function fetchTerritorial<T>(endpoint: string): Promise<T[]> {
  const url = `${getGlobalApiBaseUrl()}${endpoint}`
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  })

  const data = (await response.json()) as GenericResponse<T[]> & { message?: string }

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error: ${response.status}`)
  }

  return data.data ?? []
}

export async function getEstados(): Promise<Estado[]> {
  const result = await getGlobalUniversitasApi().territorio.getEstados()
  return result.data
}

export async function getMunicipios(estadoId: number): Promise<Municipio[]> {
  const result = await getGlobalUniversitasApi().territorio.getMunicipios(estadoId)
  return result.data
}

export async function getParroquias(municipioId: number): Promise<Parroquia[]> {
  const result = await getGlobalUniversitasApi().territorio.getParroquias(municipioId)
  return result.data
}

/** Tribunales estatales — aún no expuestos en el SDK; se consultan directo a la API. */
export async function getTribunalesEstadales(estadoId: number): Promise<Tribunal[]> {
  return fetchTerritorial<Tribunal>(`/api/v1/territorio/estados/${estadoId}/tribunales`)
}

/** Tribunales municipales — aún no expuestos en el SDK; se consultan directo a la API. */
export async function getTribunalesMunicipales(municipioId: number): Promise<Tribunal[]> {
  return fetchTerritorial<Tribunal>(`/api/v1/territorio/municipios/${municipioId}/tribunales`)
}

export type { Estado, Municipio, Parroquia }
