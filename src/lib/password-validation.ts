const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

export function validateNewPassword(password: string): string | null {
  if (!password.trim()) return 'La nueva contraseña es obligatoria.'
  if (!PASSWORD_REGEX.test(password)) {
    return 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un carácter especial.'
  }
  return null
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | null {
  if (!confirmation.trim()) return 'Confirme la nueva contraseña.'
  if (password !== confirmation) return 'Las contraseñas no coinciden.'
  return null
}
