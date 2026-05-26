'use server'

import { addMatrizAItem, addMatrizBItem, listMatrizA, listMatrizB } from '@/lib/mocks/admin-store'

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls']

// TODO(backend): POST /matrices/a
// TODO(backend): POST /matrices/b
// TODO(backend): GET /matrices/a
// TODO(backend): GET /matrices/b

function validateMatrixFile(file: File | null): string | null {
  if (!file || file.size === 0) return 'Debe seleccionar un archivo para cargar.'
  const lowerName = file.name.toLowerCase()
  const valid = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))
  if (!valid) return 'Formato no válido. Use CSV o Excel (.xlsx, .xls).'
  if (file.size > 50 * 1024 * 1024) return 'El archivo supera el tamaño máximo de 50MB.'
  return null
}

export async function listMatrizAAction() {
  try {
    return { success: true as const, data: listMatrizA() }
  } catch {
    return { success: false as const, error: 'No se pudo cargar la Matriz A.' }
  }
}

export async function listMatrizBAction() {
  try {
    return { success: true as const, data: listMatrizB() }
  } catch {
    return { success: false as const, error: 'No se pudo cargar la Matriz B.' }
  }
}

export async function uploadMatrizAAction(formData: FormData) {
  const file = formData.get('file')
  const fileObj = file instanceof File ? file : null
  const error = validateMatrixFile(fileObj)
  if (error) return { success: false as const, error }

  try {
    const item = addMatrizAItem(fileObj!.name)
    return { success: true as const, data: item }
  } catch {
    return { success: false as const, error: 'Error al procesar la Matriz A.' }
  }
}

export async function uploadMatrizBAction(formData: FormData) {
  const file = formData.get('file')
  const fileObj = file instanceof File ? file : null
  const error = validateMatrixFile(fileObj)
  if (error) return { success: false as const, error }

  try {
    const item = addMatrizBItem(fileObj!.name)
    return { success: true as const, data: item }
  } catch {
    return { success: false as const, error: 'Error al procesar la Matriz B.' }
  }
}
