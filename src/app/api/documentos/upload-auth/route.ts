import { NextResponse } from 'next/server'

import { getApiBaseUrl } from '@/lib/api'
import { getAuthFailure, getBearerToken } from '@/lib/api-client'

export const runtime = 'nodejs'

export async function GET() {
  const token = await getBearerToken()

  if (!token) {
    const failure = await getAuthFailure()
    return NextResponse.json(
      { error: failure.error, code: failure.code },
      { status: failure.status },
    )
  }

  return NextResponse.json({
    token,
    baseUrl: getApiBaseUrl(),
  })
}
