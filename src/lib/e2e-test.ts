/** Activo solo en el servidor de Playwright (ver playwright.config.ts). No usar en producción. */
export function isE2eTestMode(): boolean {
  return process.env.E2E_TEST_MODE === '1'
}
