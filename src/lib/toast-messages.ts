import { toast, type ExternalToast } from 'sonner'

import { formatUserError, toUserFacingMessage } from '@/lib/user-messages'

type ToastExtra = Omit<ExternalToast, 'description'>

/** Muestra un toast de error con mensaje amigable en español. */
export function toastError(
  title: string,
  detail?: string | null,
  fallbackDetail?: string,
  options?: ToastExtra,
): void {
  const { title: safeTitle, description } = formatUserError(title, detail, fallbackDetail)
  toast.error(safeTitle, { ...options, ...(description ? { description } : {}) })
}

/** Muestra un toast de éxito. */
export function toastSuccess(message: string, description?: string, options?: ToastExtra): void {
  toast.success(message, { ...options, ...(description ? { description } : {}) })
}

/** Muestra un toast de advertencia con detalle opcional sanitizado. */
export function toastWarning(title: string, detail?: string | null, options?: ToastExtra): void {
  toast.warning(title, {
    ...options,
    ...(detail ? { description: toUserFacingMessage(detail) } : {}),
  })
}
