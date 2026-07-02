/** Límite de body HTTP en Cloud Run (HTTP/1.1). */
export const MAX_UPLOAD_BYTES = 32 * 1024 * 1024

export const MAX_UPLOAD_MB = 32

export function formatBytesAsMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2)
}

export function isWithinUploadLimit(bytes: number): boolean {
  return bytes > 0 && bytes <= MAX_UPLOAD_BYTES
}

export function getUploadSizeErrorMessage(bytes: number): string {
  return `El archivo supera el límite de ${MAX_UPLOAD_MB} MB (tamaño: ${formatBytesAsMb(bytes)} MB).`
}

export function getTotalFormDataUploadBytes(formData: FormData): number {
  let total = 0
  for (const value of formData.values()) {
    if (value instanceof Blob) {
      total += value.size
    }
  }
  return total
}
