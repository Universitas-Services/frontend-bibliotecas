import { describe, expect, it } from 'vitest'

import {
  getTotalFormDataUploadBytes,
  isWithinUploadLimit,
  MAX_UPLOAD_BYTES,
} from '@/lib/upload-limits'

describe('upload-limits', () => {
  it('acepta archivos hasta 32 MB', () => {
    expect(isWithinUploadLimit(MAX_UPLOAD_BYTES)).toBe(true)
    expect(isWithinUploadLimit(MAX_UPLOAD_BYTES + 1)).toBe(false)
  })

  it('suma el tamaño de todos los blobs del FormData', () => {
    const formData = new FormData()
    formData.append('file', new File(['abc'], 'a.pdf'))
    formData.append('gacetaFile', new File(['de'], 'g.pdf'))

    expect(getTotalFormDataUploadBytes(formData)).toBe(5)
  })
})
