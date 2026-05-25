import { getHomePathForRole, type UserRole } from '@/lib/auth'

const ROLE_PATH_PREFIX: Record<UserRole, string> = {
  ADMIN: '/admin',
  CURADOR: '/curador',
  REVISOR: '/revisor',
  AUDITOR: '/supervisor',
}

const PROTECTED_PREFIXES = Object.values(ROLE_PATH_PREFIX)

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function getRequiredRoleForPath(pathname: string): UserRole | null {
  for (const [role, prefix] of Object.entries(ROLE_PATH_PREFIX) as [UserRole, string][]) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return role
    }
  }
  return null
}

export function isPathAllowedForRole(pathname: string, role: UserRole): boolean {
  const requiredRole = getRequiredRoleForPath(pathname)
  if (!requiredRole) return true
  return requiredRole === role
}

export function isValidRedirectForRole(redirectPath: string, role: UserRole): boolean {
  if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) {
    return false
  }
  if (!isProtectedPath(redirectPath)) {
    return false
  }
  return isPathAllowedForRole(redirectPath, role)
}

export { getHomePathForRole, ROLE_PATH_PREFIX }
