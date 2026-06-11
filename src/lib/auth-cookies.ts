export const MUST_CHANGE_PASSWORD_COOKIE = 'must_change_password'

export function isMustChangePasswordActive(cookieValue: string | undefined | null): boolean {
  return cookieValue === '1'
}
