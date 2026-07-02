import type { Metadata } from 'next'

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { AuthPageShell } from '@/components/auth/auth-page-shell'

export const metadata: Metadata = {
  title: 'Recuperar contraseña | Universitas',
  description: 'Solicite un enlace para restablecer su contraseña de acceso',
}

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <ForgotPasswordForm />
    </AuthPageShell>
  )
}
