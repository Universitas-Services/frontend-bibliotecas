import { NextResponse } from 'next/server'

import { authenticateLogin } from '@/lib/auth-login'
import { applySessionCookiesToResponse } from '@/lib/auth-cookies'

export const runtime = 'nodejs'

function buildLoginRedirectUrl(request: Request, params: Record<string, string>): URL {
  const loginUrl = new URL('/login', request.url)
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      loginUrl.searchParams.set(key, value)
    }
  }
  return loginUrl
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const redirect = String(formData.get('redirect') ?? '').trim() || null

  const result = await authenticateLogin({ email, password, redirect })

  if (!result.ok) {
    const loginUrl = buildLoginRedirectUrl(request, {
      loginError: result.error,
      ...(redirect ? { redirect } : {}),
    })
    return NextResponse.redirect(loginUrl)
  }

  const destination = new URL(result.redirectTo, request.url)
  const response = NextResponse.redirect(destination)
  applySessionCookiesToResponse(response, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    mustChangePassword: result.mustChangePassword,
  })

  return response
}
