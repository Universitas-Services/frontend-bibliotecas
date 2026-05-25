import { test, expect } from '@playwright/test'

import { createTestJwt } from './helpers/jwt'

test.describe('Route protection', () => {
  test('allows logout via /login?logout=1', async ({ context, page }) => {
    const token = createTestJwt({ role: 'REVISOR' })
    await context.addCookies([
      {
        name: 'access_token',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ])

    await page.goto('/login?logout=1', { waitUntil: 'domcontentloaded' })

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Acceso Institucional' })).toBeVisible()
    await expect(page.getByLabel('Email Institucional')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()

    const cookies = await context.cookies()
    expect(cookies.some((c) => c.name === 'access_token')).toBe(false)

    await page.goto('/revisor')
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirects unauthenticated users from /curador to /login', async ({ page }) => {
    await page.goto('/curador')
    await expect(page).toHaveURL(/\/login\?redirect=%2Fcurador/)
  })

  test('allows authenticated CURADOR to access /curador', async ({ context, page }) => {
    const token = createTestJwt({ role: 'CURADOR' })
    await context.addCookies([
      {
        name: 'access_token',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ])

    await page.goto('/curador')
    await expect(page).toHaveURL(/\/curador/)
    await expect(page.getByText('Universitas')).toBeVisible()
  })

  test('redirects CURADOR away from /supervisor', async ({ context, page }) => {
    const token = createTestJwt({ role: 'CURADOR' })
    await context.addCookies([
      {
        name: 'access_token',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ])

    await page.goto('/supervisor')
    await expect(page).toHaveURL(/\/curador/)
  })
})
