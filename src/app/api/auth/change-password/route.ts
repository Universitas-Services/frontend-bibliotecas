import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getApiBaseUrl } from '@/lib/api'
import { getHomePathForRole, getRoleFromToken, isTokenExpired } from '@/lib/auth'
import {
  ACCESS_TOKEN_COOKIE,
  applySessionCookiesToResponse,
  MUST_CHANGE_PASSWORD_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/lib/auth-cookies'

export const runtime = 'nodejs'

function buildChangePasswordRedirectUrl(request: Request, error: string): URL {
  const url = new URL('/auth/change-password', request.url)
  url.searchParams.set('changePasswordError', error)
  return url
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const flow = String(formData.get('flow') ?? '')
  const currentPassword = String(formData.get('currentPassword') ?? '')
  const newPassword = String(formData.get('newPassword') ?? '')

  if (flow !== 'first-login') {
    return NextResponse.json({ error: 'Flujo no soportado.' }, { status: 400 })
  }

  if (!currentPassword.trim()) {
    return NextResponse.redirect(
      buildChangePasswordRedirectUrl(request, 'Ingrese su contraseña actual.'),
    )
  }

  if (newPassword.trim().length < 8) {
    return NextResponse.redirect(
      buildChangePasswordRedirectUrl(
        request,
        'La nueva contraseña debe tener al menos 8 caracteres.',
      ),
    )
  }

  if (currentPassword === newPassword) {
    return NextResponse.redirect(
      buildChangePasswordRedirectUrl(
        request,
        'La nueva contraseña no puede ser igual a la contraseña actual.',
      ),
    )
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login?logout=1&authReason=missing', request.url))
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
      const message =
        typeof data.message === 'string'
          ? data.message
          : 'No se pudo actualizar la contraseña. Intente nuevamente.'
      if (res.status === 403) {
        const response = NextResponse.redirect(new URL('/login?logout=1', request.url))
        response.cookies.delete(ACCESS_TOKEN_COOKIE)
        response.cookies.delete(MUST_CHANGE_PASSWORD_COOKIE)
        return response
      }
      return NextResponse.redirect(buildChangePasswordRedirectUrl(request, message))
    }

    const newToken = typeof data.access_token === 'string' ? data.access_token : null
    const newRefreshToken =
      typeof data.refresh_token === 'string'
        ? data.refresh_token
        : typeof data.refreshToken === 'string'
          ? data.refreshToken
          : null

    if (!newToken || isTokenExpired(newToken)) {
      return NextResponse.redirect(
        buildChangePasswordRedirectUrl(request, 'No se recibió un token de acceso actualizado.'),
      )
    }

    if (!newRefreshToken || isTokenExpired(newRefreshToken)) {
      return NextResponse.redirect(
        buildChangePasswordRedirectUrl(
          request,
          'No se recibió un token de sesión válido. Intente iniciar sesión nuevamente.',
        ),
      )
    }

    const role = getRoleFromToken(newToken)
    if (!role) {
      return NextResponse.redirect(
        buildChangePasswordRedirectUrl(
          request,
          'No pudimos identificar su rol de usuario. Contacte al administrador.',
        ),
      )
    }

    const destination = new URL(getHomePathForRole(role), request.url)
    const response = NextResponse.redirect(destination)
    applySessionCookiesToResponse(response, {
      accessToken: newToken,
      refreshToken: newRefreshToken,
      mustChangePassword: false,
    })

    return response
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.redirect(
      buildChangePasswordRedirectUrl(
        request,
        'Ocurrió un error al actualizar la contraseña. Revise su conexión.',
      ),
    )
  }
}
