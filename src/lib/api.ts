const DEFAULT_API_BASE_URL = 'https://biblioteca-legal-backend.onrender.com'

export function getApiBaseUrl(): string {
  const url = process.env.API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
  return url.replace(/\/$/, '')
}
