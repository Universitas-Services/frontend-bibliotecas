import {
  getCarpetaInternaDetalleAction,
  getCarpetasInternasHijosAction,
  getTiposNormaAction,
} from '@/app/actions/temas'
import type { CarpetaInterna } from '@/lib/temas-taxonomy'
import { getTipoNormaDisplayName } from '@/lib/temas-taxonomy'

export type CarpetaLevelState = {
  options: CarpetaInterna[]
  selectedId: string
  loading: boolean
}

export type RestoreCarpetaPathResult = {
  levels: CarpetaLevelState[]
  leafId: string
  pathNames: string[]
}

function ensureOptionInList(options: CarpetaInterna[], carpeta: CarpetaInterna): CarpetaInterna[] {
  if (options.some((item) => item.id === carpeta.id)) {
    return options
  }
  return [...options, carpeta]
}

async function buildAncestorIds(leafId: string): Promise<string[]> {
  const chain: string[] = []
  const visited = new Set<string>()
  let currentId: string | null = leafId

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId)
    chain.unshift(currentId)

    const detail = await getCarpetaInternaDetalleAction(currentId)
    if (!detail?.parentId?.trim()) break
    currentId = detail.parentId.trim()
  }

  return chain
}

/** Reconstruye niveles de selects desde subcarpeta + carpeta hoja (walk por parentId). */
export async function restoreCarpetaLevelsFromLeaf(
  subcarpetaNormaId: string,
  leafCarpetaId: string,
): Promise<RestoreCarpetaPathResult> {
  const trimmedLeaf = leafCarpetaId.trim()
  const trimmedSubcarpeta = subcarpetaNormaId.trim()

  if (!trimmedSubcarpeta || !trimmedLeaf) {
    return { levels: [], leafId: '', pathNames: [] }
  }

  const ancestorIds = await buildAncestorIds(trimmedLeaf)
  if (ancestorIds.length === 0) {
    return { levels: [], leafId: trimmedLeaf, pathNames: [] }
  }

  const rootOptions = await getTiposNormaAction(trimmedSubcarpeta)
  const levels: CarpetaLevelState[] = []
  const pathNames: string[] = []

  let rootOptionsWithSelection = rootOptions
  const rootId = ancestorIds[0]
  const rootDetail = await getCarpetaInternaDetalleAction(rootId)
  if (rootDetail) {
    rootOptionsWithSelection = ensureOptionInList(rootOptions, rootDetail)
    pathNames.push(getTipoNormaDisplayName(rootDetail))
  }

  levels.push({
    options: rootOptionsWithSelection,
    selectedId: rootId,
    loading: false,
  })

  for (let index = 0; index < ancestorIds.length - 1; index += 1) {
    const parentId = ancestorIds[index]
    const selectedId = ancestorIds[index + 1]
    let siblings = await getCarpetasInternasHijosAction(parentId)
    const selectedDetail = await getCarpetaInternaDetalleAction(selectedId)
    if (selectedDetail) {
      siblings = ensureOptionInList(siblings, selectedDetail)
      pathNames.push(getTipoNormaDisplayName(selectedDetail))
    }

    levels.push({
      options: siblings,
      selectedId,
      loading: false,
    })
  }

  return {
    levels,
    leafId: trimmedLeaf,
    pathNames,
  }
}
