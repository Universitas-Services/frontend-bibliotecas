export const DEFAULT_API_BASE_URL =
  'https://biblioteca-legal-backend-693924722323.us-central1.run.app'

export function getApiBaseUrl(): string {
  const url = process.env.API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
  return url.replace(/\/$/, '')
}
