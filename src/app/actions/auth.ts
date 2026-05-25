'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getApiBaseUrl } from '@/lib/api'
import { getHomePathForRole, getRoleFromToken } from '@/lib/auth'
import { isValidRedirectForRole } from '@/lib/route-guards'

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string | null

  if (!email || !password) {
    return { error: 'Por favor, ingrese correo y contraseña.' }
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
      return { error: data.message || 'Credenciales inválidas. Intente nuevamente.' }
    }

    const token = data.access_token

    if (!token) {
      return { error: 'No se recibió un token de acceso.' }
    }

    const role = getRoleFromToken(token)

    const cookieStore = await cookies()
    cookieStore.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    if (!role) {
      console.warn('No se encontró el rol en el token')
      return { error: 'No se pudo determinar el rol del usuario.' }
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

  cookieStore.delete('access_token')
  redirect('/login')
}
