import type { AssignableRole, CreateUserInput } from '@/lib/types/admin'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'El correo electrónico es obligatorio.'
  if (!EMAIL_REGEX.test(email.trim())) return 'Ingrese un correo electrónico válido.'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña temporal es obligatoria.'
  if (!PASSWORD_REGEX.test(password)) {
    return 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un carácter especial.'
  }
  return null
}

export function validateCreateUserInput(input: CreateUserInput): string | null {
  if (!input.nombre.trim()) return 'El nombre es obligatorio.'
  if (!input.apellido.trim()) return 'El apellido es obligatorio.'

  const emailError = validateEmail(input.email)
  if (emailError) return emailError

  const passwordError = validatePassword(input.password)
  if (passwordError) return passwordError

  if (!input.rol) return 'Debe asignar un rol en la plataforma.'

  if (input.rol === 'REVISOR' && !input.temaPrincipalId) {
    return 'Debe seleccionar un tema principal para el revisor.'
  }

  if (input.rol !== 'REVISOR' && input.temaPrincipalId) {
    return 'El tema principal solo aplica para usuarios con rol Revisor.'
  }

  return null
}

export function requiresTemaPrincipal(rol: AssignableRole | ''): boolean {
  return rol === 'REVISOR'
}
