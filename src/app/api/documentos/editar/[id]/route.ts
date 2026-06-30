import { NextResponse } from 'next/server'

import { proxyMultipartToBackend } from '@/lib/api-client'

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params
  const result = await proxyMultipartToBackend(
    request,
    `/documentos/editar/${encodeURIComponent(id)}`,
    'PUT',
  )

  if (!result.success) {
    return NextResponse.json(
      { error: result.error, details: result.details, code: result.code },
      { status: result.status ?? 500 },
    )
  }

  return NextResponse.json(result.data, { status: result.status })
}
