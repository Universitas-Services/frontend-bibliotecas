'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

function decodeJwt(token: string) {
  try {
    const payloadBase64 = token.split('.')[1]
    const decodedPayload = Buffer.from(payloadBase64, 'base64').toString('utf-8')
    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Por favor, ingrese correo y contraseña.' }
  }

  try {
    const res = await fetch('https://biblioteca-legal-backend.onrender.com/auth/login', {
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

    // Decodificar el token para obtener el rol
    const decodedToken = decodeJwt(token)

    // Guardar el token en una cookie HTTP-only
    const cookieStore = await cookies()
    cookieStore.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    })

    // Redirigir según el rol
    // Nota: Dependiendo de cómo el backend guarde el rol en el JWT,
    // podría llamarse 'role', 'roles', etc. Asumimos 'role' por defecto.
    const role = decodedToken?.role || decodedToken?.roles || decodedToken?.Role

    if (!role) {
      console.warn('No se encontró el rol en el token:', decodedToken)
      // Fallback a una ruta por defecto o mostrar error
      // return { error: 'No se pudo determinar el rol del usuario.' }
    }

    const roleName = String(role).toUpperCase()

    // Manejar redirecciones según el enum del backend
    if (roleName === 'ADMIN') {
      redirect('/admin')
    } else if (roleName === 'CURADOR') {
      redirect('/curador')
    } else if (roleName === 'REVISOR') {
      redirect('/revisor')
    } else if (roleName === 'AUDITOR') {
      redirect('/supervisor')
    } else {
      // Si es CLIENTE u otro rol no contemplado
      return { error: 'No tiene permisos para acceder a este portal.' }
    }
  } catch (error) {
    // Si el error es una redirección de Next.js, lo lanzamos de nuevo
    if ((error as Error).message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Login error:', error)
    return { error: 'Ocurrió un error al intentar iniciar sesión. Revise su conexión.' }
  }
}
