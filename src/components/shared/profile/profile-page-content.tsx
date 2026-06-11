import { ChangePasswordForm } from '@/components/shared/profile/change-password-form'
import { ProfileOverview } from '@/components/shared/profile/profile-overview'
import { getHomePathForRole, type UserRole } from '@/lib/auth'
import type { SessionUser } from '@/lib/session-shared'

type ProfilePageContentProps = {
  user: SessionUser
  forced?: boolean
}

export function ProfilePageContent({ user, forced = false }: ProfilePageContentProps) {
  const homePath = getHomePathForRole(user.role.toUpperCase() as UserRole)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="font-['Space_Grotesk'] text-[32px] font-bold tracking-tight text-[#0F1D30]">
          Mi perfil
        </h1>
        <p className="mt-1 text-[15px] text-slate-500">
          Consulte sus datos de cuenta y gestione su contraseña de acceso.
        </p>
      </div>

      {user.mustChangePassword ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Tiene una contraseña temporal activa. Debe cambiarla para cumplir con la política de
          seguridad de la plataforma.
        </div>
      ) : null}

      <ProfileOverview user={user} />
      <ChangePasswordForm forced={forced || Boolean(user.mustChangePassword)} homePath={homePath} />
    </div>
  )
}
