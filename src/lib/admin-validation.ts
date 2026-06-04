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

  const needsTema = requiresTemaPrincipal(input.rol)

  if (needsTema && (!input.temaIds || input.temaIds.length === 0)) {
    return 'Debe seleccionar al menos un tema principal.'
  }

  if (!needsTema && input.temaIds && input.temaIds.length > 0) {
    return 'El tema principal solo aplica para roles Revisor y Curador.'
  }

  return null
}

export function requiresTemaPrincipal(rol: AssignableRole | ''): boolean {
  return rol === 'REVISOR' || rol === 'CURADOR'
}
