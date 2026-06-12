export function createTestJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(
    JSON.stringify({
      sub: 'e2e-test-user',
      email: 'e2e@test.local',
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...payload,
    }),
  ).toString('base64')
  return `${header}.${body}.signature`
}
