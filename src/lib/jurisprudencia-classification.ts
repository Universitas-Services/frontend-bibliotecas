import type { CarpetaInterna } from '@/lib/temas-taxonomy'

/** Ramas bajo Nacional cuando el backend aún no expone hijos en la taxonomía. */
export const JURISPRUDENCIA_RAMAS_NACIONAL = [
  'Tribunal Supremo de Justicia',
  'Cortes Contencioso Administrativas',
  'Tribunales',
] as const

export const VIRTUAL_JURISPRUDENCIA_RAMA_PREFIX = '__juris_rama__:'

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function isJurisprudenciaDocumentType(tipoDocumentoNombre: string): boolean {
  return normalize(tipoDocumentoNombre).includes('jurisprudencia')
}

export function isNacionalCarpetaName(carpetaNombre: string): boolean {
  return normalize(carpetaNombre) === 'nacional'
}

export function isVirtualJurisprudenciaRamaId(carpetaId: string): boolean {
  return carpetaId.startsWith(VIRTUAL_JURISPRUDENCIA_RAMA_PREFIX)
}

export function getJurisprudenciaNacionalBranchOptions(): CarpetaInterna[] {
  return JURISPRUDENCIA_RAMAS_NACIONAL.map((nombre) => ({
    id: `${VIRTUAL_JURISPRUDENCIA_RAMA_PREFIX}${nombre}`,
    nombreCarpeta: nombre,
    slug: normalize(nombre).replace(/\s+/g, '-'),
  }))
}

export function needsJurisprudenciaNacionalSubrama(
  tipoDocumentoNombre: string,
  carpetaPathNames: string[],
): boolean {
  if (!isJurisprudenciaDocumentType(tipoDocumentoNombre)) return false
  if (carpetaPathNames.length !== 1) return false
  return isNacionalCarpetaName(carpetaPathNames[0] ?? '')
}
