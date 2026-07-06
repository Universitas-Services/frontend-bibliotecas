import { getApiBaseUrl } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/api-client'
import { getHomePathForRole, getRoleFromToken, isTokenExpired, decodeJwt } from '@/lib/auth'
import { isValidRedirectForRole } from '@/lib/route-guards'
import { toUserFacingMessage, USER_MSG } from '@/lib/user-messages'

const CHANGE_PASSWORD_PATH = '/auth/change-password'

export type AuthenticateLoginInput = {
  email: string
  password: string
  redirect?: string | null
}

export type AuthenticateLoginResult =
  | {
      ok: true
      accessToken: string
      refreshToken?: string | null
      mustChangePassword: boolean
      redirectTo: string
    }
  | { ok: false; error: string; status?: number }

function readAuthTokens(data: Record<string, unknown>): {
  accessToken: string
  refreshToken: string | null
} {
  const accessToken =
    typeof data.access_token === 'string'
      ? data.access_token
      : typeof data.accessToken === 'string'
        ? data.accessToken
        : ''

  const refreshToken =
    typeof data.refresh_token === 'string'
      ? data.refresh_token
      : typeof data.refreshToken === 'string'
        ? data.refreshToken
        : null

  return { accessToken, refreshToken }
}

export async function authenticateLogin(
  input: AuthenticateLoginInput,
): Promise<AuthenticateLoginResult> {
  const email = input.email.trim()
  const password = input.password

  if (!email || !password) {
    return { ok: false, error: USER_MSG.validation.loginCredentials }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (!res.ok) {
      const backendMessage = getApiErrorMessage(data, USER_MSG.error.login)
      console.error('[auth/login] backend rejected credentials', {
        status: res.status,
        apiBaseUrl: getApiBaseUrl(),
        message: backendMessage,
        raw: data,
      })
      return {
        ok: false,
        status: res.status,
        error: toUserFacingMessage(backendMessage, USER_MSG.error.login),
      }
    }

    const { accessToken, refreshToken } = readAuthTokens(data)
    const mustChangePassword = data.mustChangePassword === true

    if (!accessToken) {
      return {
        ok: false,
        error: 'No recibimos confirmación de acceso. Intente iniciar sesión nuevamente.',
      }
    }

    if (isTokenExpired(accessToken)) {
      return {
        ok: false,
        error:
          'El servidor devolvió un token inválido. Intente nuevamente o contacte al administrador.',
      }
    }

    const role = getRoleFromToken(accessToken)
    if (!role) {
      console.error('[auth/login] token without recognizable role', {
        apiBaseUrl: getApiBaseUrl(),
        payloadKeys: Object.keys(decodeJwt(accessToken) ?? {}),
      })
      return {
        ok: false,
        error: 'No pudimos identificar su rol de usuario. Contacte al administrador.',
      }
    }

    if (!mustChangePassword && !refreshToken) {
      console.warn(
        '[auth/login] login OK but refresh_token missing (backend refresh not active?)',
        {
          apiBaseUrl: getApiBaseUrl(),
        },
      )
    }

    let redirectTo: string
    if (mustChangePassword) {
      redirectTo = CHANGE_PASSWORD_PATH
    } else if (input.redirect && isValidRedirectForRole(input.redirect, role)) {
      redirectTo = input.redirect
    } else {
      redirectTo = getHomePathForRole(role)
    }

    return { ok: true, accessToken, refreshToken, mustChangePassword, redirectTo }
  } catch (error) {
    console.error('[auth/login] network or unexpected error', {
      apiBaseUrl: getApiBaseUrl(),
      error,
    })
    return { ok: false, error: 'Ocurrió un error al intentar iniciar sesión. Revise su conexión.' }
  }
}
