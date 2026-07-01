'use server'

import {
  getEstados,
  getMunicipios,
  getParroquias,
  getTribunalesEstadales,
  getTribunalesMunicipales,
  type Estado,
  type Municipio,
  type Parroquia,
  type Tribunal,
} from '@/lib/global-universitas-client'

type TerritorioSuccess<T> = { success: true; data: T }
type TerritorioFailure = { success: false; error: string }
export type TerritorioResult<T> = TerritorioSuccess<T> | TerritorioFailure

function parsePositiveId(value: number): number | null {
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.trunc(value)
}

async function wrapTerritorioCall<T>(fn: () => Promise<T>): Promise<TerritorioResult<T>> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al consultar la API Global.'
    return { success: false, error: message }
  }
}

export async function getEstadosAction(): Promise<TerritorioResult<Estado[]>> {
  return wrapTerritorioCall(() => getEstados())
}

export async function getMunicipiosByEstadoAction(
  estadoId: number,
): Promise<TerritorioResult<Municipio[]>> {
  const id = parsePositiveId(estadoId)
  if (!id) {
    return { success: false, error: 'ID de estado inválido.' }
  }
  return wrapTerritorioCall(() => getMunicipios(id))
}

export async function getParroquiasByMunicipioAction(
  municipioId: number,
): Promise<TerritorioResult<Parroquia[]>> {
  const id = parsePositiveId(municipioId)
  if (!id) {
    return { success: false, error: 'ID de municipio inválido.' }
  }
  return wrapTerritorioCall(() => getParroquias(id))
}

export async function getTribunalesEstadalesAction(
  estadoId: number,
): Promise<TerritorioResult<Tribunal[]>> {
  const id = parsePositiveId(estadoId)
  if (!id) {
    return { success: false, error: 'ID de estado inválido.' }
  }
  return wrapTerritorioCall(() => getTribunalesEstadales(id))
}

export async function getTribunalesMunicipalesAction(
  municipioId: number,
): Promise<TerritorioResult<Tribunal[]>> {
  const id = parsePositiveId(municipioId)
  if (!id) {
    return { success: false, error: 'ID de municipio inválido.' }
  }
  return wrapTerritorioCall(() => getTribunalesMunicipales(id))
}
