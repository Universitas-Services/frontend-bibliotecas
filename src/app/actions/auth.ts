'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getApiBaseUrl } from '@/lib/api'
import { getHomePathForRole, getRoleFromToken } from '@/lib/auth'
import { MUST_CHANGE_PASSWORD_COOKIE } from '@/lib/auth-cookies'
import { validateNewPassword, validatePasswordConfirmation } from '@/lib/password-validation'
import { toUserFacingMessage, USER_MSG } from '@/lib/user-messages'
import { isValidRedirectForRole } from '@/lib/route-guards'

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7

function setAccessTokenCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, token: string) {
  cookieStore.set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_MAX_AGE,
  })
}

function setMustChangePasswordCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  active: boolean,
) {
  if (active) {
    cookieStore.set(MUST_CHANGE_PASSWORD_COOKIE, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30,
    })
    return
  }

  cookieStore.delete(MUST_CHANGE_PASSWORD_COOKIE)
}

function clearAuthCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.delete('access_token')
  cookieStore.delete(MUST_CHANGE_PASSWORD_COOKIE)
}

function mapChangePasswordError(status: number, data: Record<string, unknown>): string {
  const message = typeof data.message === 'string' ? data.message : ''

  switch (status) {
    case 401:
      return 'La contraseña actual no es correcta. Verifícala con tu administrador.'
    case 400:
      return 'La nueva contraseña no puede ser igual a la contraseña actual.'
    case 422:
      return 'La nueva contraseña debe tener al menos 8 caracteres.'
    case 403:
      return 'Tu sesión expiró. Por favor vuelve a iniciar sesión.'
    default:
      return message || 'No se pudo actualizar la contraseña. Intente nuevamente.'
  }
}

export type ChangePasswordState = {
  success?: boolean
  error?: string
  message?: string
  sessionExpired?: boolean
}

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string | null

  if (!email || !password) {
    return { error: USER_MSG.validation.loginCredentials }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        error: toUserFacingMessage(
          typeof data.message === 'string' ? data.message : undefined,
          USER_MSG.error.login,
        ),
      }
    }

    const token = data.access_token
    const mustChangePassword = data.mustChangePassword === true

    if (!token) {
      return { error: 'No recibimos confirmación de acceso. Intente iniciar sesión nuevamente.' }
    }

    const role = getRoleFromToken(token)

    const cookieStore = await cookies()
    setAccessTokenCookie(cookieStore, token)
    setMustChangePasswordCookie(cookieStore, mustChangePassword)

    if (!role) {
      console.warn('No se encontró el rol en el token')
      return { error: 'No pudimos identificar su rol de usuario. Contacte al administrador.' }
    }

    if (mustChangePassword) {
      redirect('/auth/change-password')
    }

    if (redirectTo && isValidRedirectForRole(redirectTo, role)) {
      redirect(redirectTo)
    }

    redirect(getHomePathForRole(role))
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Login error:', error)
    return { error: 'Ocurrió un error al intentar iniciar sesión. Revise su conexión.' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (token) {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: 'POST',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      })
    } catch {
      // No bloquear el cierre de sesión local si el backend no responde
    }
  }

  clearAuthCookies(cookieStore)
  redirect('/login')
}

export async function changePasswordAction(
  _prevState: ChangePasswordState | null,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get('currentPassword') ?? '')
  const newPassword = String(formData.get('newPassword') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')
  const flow = String(formData.get('flow') ?? 'profile')
  const isFirstLogin = flow === 'first-login'

  if (!currentPassword.trim()) {
    return { error: 'Ingrese su contraseña actual.' }
  }

  if (!isFirstLogin) {
    const newPasswordError = validateNewPassword(newPassword)
    if (newPasswordError) {
      return { error: newPasswordError }
    }

    const confirmError = validatePasswordConfirmation(newPassword, confirmPassword)
    if (confirmError) {
      return { error: confirmError }
    }
  } else if (newPassword.trim().length < 8) {
    return { error: 'La nueva contraseña debe tener al menos 8 caracteres.' }
  }

  if (currentPassword === newPassword) {
    return { error: 'La nueva contraseña no puede ser igual a la contraseña actual.' }
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { sessionExpired: true, error: 'Tu sesión expiró. Por favor vuelve a iniciar sesión.' }
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

    if (!res.ok) {
      if (res.status === 403) {
        clearAuthCookies(cookieStore)
        return { sessionExpired: true, error: mapChangePasswordError(res.status, data) }
      }

      return { error: mapChangePasswordError(res.status, data) }
    }

    const newToken = typeof data.access_token === 'string' ? data.access_token : null
    if (!newToken) {
      return { error: 'No se recibió un token de acceso actualizado.' }
    }

    const role = getRoleFromToken(newToken)
    if (!role) {
      return { error: 'No pudimos identificar su rol de usuario. Contacte al administrador.' }
    }

    setAccessTokenCookie(cookieStore, newToken)
    setMustChangePasswordCookie(cookieStore, false)

    if (isFirstLogin) {
      redirect(getHomePathForRole(role))
    }

    return {
      success: true,
      message:
        typeof data.message === 'string' ? data.message : 'Contraseña actualizada exitosamente.',
    }
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error('Change password error:', error)
    return { error: 'Ocurrió un error al actualizar la contraseña. Revise su conexión.' }
  }
}
