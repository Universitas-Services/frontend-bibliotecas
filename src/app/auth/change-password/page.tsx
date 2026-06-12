import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { FirstLoginChangePasswordForm } from '@/components/auth/first-login-change-password-form'
import { getHomePathForRole, getRoleFromToken } from '@/lib/auth'
import { isMustChangePasswordActive, MUST_CHANGE_PASSWORD_COOKIE } from '@/lib/auth-cookies'

export default async function ChangePasswordPage() {
  const cookieStore = await cookies()
  const mustChangePassword = isMustChangePasswordActive(
    cookieStore.get(MUST_CHANGE_PASSWORD_COOKIE)?.value,
  )

  if (!mustChangePassword) {
    const token = cookieStore.get('access_token')?.value
    const role = token ? getRoleFromToken(token) : null
    if (role) {
      redirect(getHomePathForRole(role))
    }
    redirect('/login')
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="mb-8 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/LOGO UNIVERSITAS LEGAL.png"
          alt="Universitas Legal"
          className="h-24 w-auto object-contain brightness-0 drop-shadow-md invert"
        />
      </div>

      <div className="w-full max-w-[480px]">
        <FirstLoginChangePasswordForm />
      </div>
    </div>
  )
}
