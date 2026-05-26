import { test, expect } from '@playwright/test'

import { createTestJwt } from './helpers/jwt'

async function loginAsAdmin(context: import('@playwright/test').BrowserContext) {
  const token = createTestJwt({ role: 'ADMIN' })
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
}

test.describe('Admin panel', () => {
  test('redirects /admin to usuarios and shows sidebar', async ({ context, page }) => {
    await loginAsAdmin(context)
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/usuarios/)
    await expect(page.getByRole('link', { name: 'Productos' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Gestión de usuarios' })).toBeVisible()
  })

  test('shows tema principal field when REVISOR role is selected', async ({ context, page }) => {
    await loginAsAdmin(context)
    await page.goto('/admin/usuarios/nuevo')

    await expect(page.getByLabel('Asignar Rol en la plataforma')).toBeVisible()
    await expect(page.getByLabel('Tema principal')).not.toBeVisible()

    await page.getByRole('combobox', { name: 'Asignar Rol en la plataforma' }).click()
    await page.getByRole('option', { name: 'Revisor' }).click()

    await expect(page.getByLabel('Tema principal')).toBeVisible()
  })

  test('navigates to catalogo matrices pages', async ({ context, page }) => {
    await loginAsAdmin(context)
    await page.goto('/admin/catalogo/productos')
    await expect(page.getByRole('heading', { name: 'Productos — Matriz A' })).toBeVisible()

    await page.goto('/admin/catalogo/agora')
    await expect(page.getByRole('heading', { name: 'Ágora — Matriz B' })).toBeVisible()
  })

  test('redirects non-admin away from /admin', async ({ context, page }) => {
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

    await page.goto('/admin/usuarios')
    await expect(page).toHaveURL(/\/curador/)
  })
})
