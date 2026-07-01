import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: process.env.CI
    ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      API_BASE_URL:
        process.env.API_BASE_URL ??
        'https://biblioteca-legal-backend-693924722323.us-central1.run.app',
      GLOBAL_API_BASE_URL:
        process.env.GLOBAL_API_BASE_URL ??
        'https://api-global-universitas-693924722323.us-central1.run.app',
      NEXT_PUBLIC_API_URL:
        process.env.NEXT_PUBLIC_API_URL ??
        'https://api-global-universitas-693924722323.us-central1.run.app',
      E2E_TEST_MODE: '1',
    },
  },
})
