import { cookies } from 'next/headers'

import { getUserMeAction } from '@/app/actions/profile'
import { decodeJwt, isTokenExpired } from '@/lib/auth'
import {
  ACCESS_TOKEN_COOKIE,
  isMustChangePasswordActive,
  MUST_CHANGE_PASSWORD_COOKIE,
} from '@/lib/auth-cookies'
import { isE2eTestMode } from '@/lib/e2e-test'
import {
  buildInitials,
  mapMeToSessionUser,
  resolveDisplayNames,
  type GetSessionUserResult,
  type SessionUser,
} from '@/lib/session-shared'

export type { GetSessionUserResult, SessionUser } from '@/lib/session-shared'
export {
  formatDocumentDate,
  formatSessionDisplayName,
  getDocumentTimestamp,
} from '@/lib/session-shared'

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function readMustChangePasswordFromJwt(payload: Record<string, unknown>): boolean {
  const candidates = [
    payload.mustChangePassword,
    payload.debeCambiarPassword,
    payload.passwordTemporal,
    payload.requiereCambioPassword,
  ]

  return candidates.some((value) => value === true || value === 'true' || value === 1)
}

function getSessionUserFromJwt(token: string, mustChangePassword = false): SessionUser | null {
  const payload = decodeJwt(token)
  if (!payload) return null

  const email = readString(payload.email) || readString(payload.sub)
  const { nombre, apellido } = resolveDisplayNames(
    readString(payload.nombre) || readString(payload.name) || readString(payload.given_name),
    readString(payload.apellido) || readString(payload.family_name),
    email,
  )
  const role = readString(payload.role ?? payload.roles ?? payload.Role) || 'CURADOR'
  const id = readString(payload.sub) || email

  if (!email && !id) return null

  return {
    id,
    nombre,
    apellido,
    email: email || id,
    role,
    initials: buildInitials(nombre, apellido),
    mustChangePassword: mustChangePassword || readMustChangePasswordFromJwt(payload),
  }
}

export async function getSessionUser(): Promise<GetSessionUserResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!token) {
    return { user: null, sessionInvalid: true }
  }

  if (isTokenExpired(token)) {
    return { user: null, sessionInvalid: true }
  }

  const mustChangePassword = isMustChangePasswordActive(
    cookieStore.get(MUST_CHANGE_PASSWORD_COOKIE)?.value,
  )

  if (mustChangePassword) {
    const restrictedUser = getSessionUserFromJwt(token, true)
    return { user: restrictedUser, sessionInvalid: false }
  }

  if (isE2eTestMode()) {
    const e2eUser = getSessionUserFromJwt(token)
    return e2eUser ? { user: e2eUser, sessionInvalid: false } : { user: null, sessionInvalid: true }
  }

  const me = await getUserMeAction()

  if (!me.success && 'sessionInvalid' in me && me.sessionInvalid) {
    return { user: null, sessionInvalid: true }
  }

  if (me.success) {
    return { user: mapMeToSessionUser(me.data), sessionInvalid: false }
  }

  const fallbackUser = getSessionUserFromJwt(token)
  if (!fallbackUser) {
    return { user: null, sessionInvalid: false }
  }

  return { user: fallbackUser, sessionInvalid: false }
}
