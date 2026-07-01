import { describe, expect, it } from 'vitest'

import { toUserFacingMessage, translateBackendError, USER_MSG } from '@/lib/user-messages'

describe('user-messages', () => {
  it('traduce errores HTTP comunes', () => {
    expect(translateBackendError('Unauthorized')).toBe(USER_MSG.common.notAuthorized)
    expect(translateBackendError('Not Found')).toContain('encontramos')
  })

  it('oculta errores técnicos de GCP al usuario', () => {
    const raw =
      "Error al generar la URL firmada: Permission 'iam.serviceAccounts.signBlob' denied on resource"
    expect(toUserFacingMessage(raw)).toBe(USER_MSG.preview.unavailable)
  })

  it('mantiene mensajes ya amigables en español', () => {
    expect(toUserFacingMessage('El título es obligatorio.', 'fallback')).toBe(
      'El título es obligatorio.',
    )
  })

  it('usa fallback cuando el mensaje es demasiado técnico', () => {
    const raw = 'Error at StorageController.signUrl (node:internal/process/task_queues:95:5)'
    expect(toUserFacingMessage(raw, 'Mensaje genérico')).toBe('Mensaje genérico')
  })

  it('detecta errores de red', () => {
    expect(toUserFacingMessage('fetch failed')).toBe(USER_MSG.common.connection)
  })
})
