export const ROLE_DISPLAY_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  CURADOR: 'Curador',
  REVISOR: 'Revisor',
  AUDITOR: 'Auditor',
  CLIENTE: 'Cliente',
}

export function getRoleLabel(role: string): string {
  return ROLE_DISPLAY_LABELS[role.toUpperCase()] || role
}

export function getProfilePathForRole(role: string): string {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return '/admin/perfil'
    case 'CURADOR':
      return '/curador/perfil'
    case 'REVISOR':
      return '/revisor/perfil'
    case 'AUDITOR':
      return '/supervisor/perfil'
    default:
      return '/login'
  }
}
