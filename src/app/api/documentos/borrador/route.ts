import { NextResponse } from 'next/server'

import { proxyMultipartToBackend } from '@/lib/api-client'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const result = await proxyMultipartToBackend(request, '/documentos/borrador', 'POST')

  if (!result.success) {
    return NextResponse.json(
      { error: result.error, details: result.details, code: result.code },
      { status: result.status ?? 500 },
    )
  }

  return NextResponse.json(result.data, { status: result.status })
}
