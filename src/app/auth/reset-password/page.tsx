import type { Metadata } from 'next'

import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { AuthPageShell } from '@/components/auth/auth-page-shell'

export const metadata: Metadata = {
  title: 'Restablecer contraseña | Universitas',
  description: 'Establezca una nueva contraseña de acceso',
}

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams
  const token = typeof params.token === 'string' ? params.token.trim() : ''

  return (
    <AuthPageShell maxWidthClassName="max-w-[440px]">
      <ResetPasswordForm token={token} />
    </AuthPageShell>
  )
}
