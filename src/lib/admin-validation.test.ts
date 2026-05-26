import { describe, expect, it } from 'vitest'

import {
  requiresTemaPrincipal,
  validateCreateUserInput,
  validateEmail,
  validatePassword,
} from '@/lib/admin-validation'

describe('admin-validation', () => {
  it('validates email format', () => {
    expect(validateEmail('')).toMatch(/obligatorio/)
    expect(validateEmail('invalid')).toMatch(/válido/)
    expect(validateEmail('user@example.com')).toBeNull()
  })

  it('validates password rules', () => {
    expect(validatePassword('short')).toMatch(/mínimo 8/)
    expect(validatePassword('abcdefgh')).toMatch(/mayúscula/)
    expect(validatePassword('Abcdefgh')).toMatch(/especial/)
    expect(validatePassword('A123456*')).toBeNull()
  })

  it('requires tema principal for REVISOR', () => {
    expect(
      validateCreateUserInput({
        nombre: 'Pedro',
        apellido: 'López',
        email: 'pedro@example.com',
        password: 'A123456*',
        rol: 'REVISOR',
      }),
    ).toMatch(/tema principal/)

    expect(
      validateCreateUserInput({
        nombre: 'Pedro',
        apellido: 'López',
        email: 'pedro@example.com',
        password: 'A123456*',
        rol: 'REVISOR',
        temaPrincipalId: 'propiedad-intelectual',
      }),
    ).toBeNull()
  })

  it('rejects tema principal for non-revisor roles', () => {
    expect(
      validateCreateUserInput({
        nombre: 'Ana',
        apellido: 'Ruiz',
        email: 'ana@example.com',
        password: 'A123456*',
        rol: 'CURADOR',
        temaPrincipalId: 'normativa-digital',
      }),
    ).toMatch(/solo aplica/)
  })

  it('detects when tema field should be shown', () => {
    expect(requiresTemaPrincipal('REVISOR')).toBe(true)
    expect(requiresTemaPrincipal('CURADOR')).toBe(false)
    expect(requiresTemaPrincipal('')).toBe(false)
  })
})
