import { describe, expect, it } from 'vitest'

import {
  getRequiredRoleForPath,
  isPathAllowedForRole,
  isProtectedPath,
  isValidRedirectForRole,
} from '@/lib/route-guards'

describe('route-guards', () => {
  it('detects protected paths', () => {
    expect(isProtectedPath('/curador')).toBe(true)
    expect(isProtectedPath('/curador/gestion-documental')).toBe(true)
    expect(isProtectedPath('/login')).toBe(false)
  })

  it('maps path to required role', () => {
    expect(getRequiredRoleForPath('/supervisor')).toBe('AUDITOR')
    expect(getRequiredRoleForPath('/curador/nueva-carga')).toBe('CURADOR')
  })

  it('allows path only for matching role', () => {
    expect(isPathAllowedForRole('/curador', 'CURADOR')).toBe(true)
    expect(isPathAllowedForRole('/supervisor', 'CURADOR')).toBe(false)
  })

  it('validates redirect paths per role', () => {
    expect(isValidRedirectForRole('/curador/gestion-documental', 'CURADOR')).toBe(true)
    expect(isValidRedirectForRole('/supervisor', 'CURADOR')).toBe(false)
    expect(isValidRedirectForRole('https://evil.com', 'CURADOR')).toBe(false)
  })
})
