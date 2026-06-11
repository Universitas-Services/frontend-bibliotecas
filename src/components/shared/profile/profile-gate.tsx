import { ForcePasswordChangeDialog } from '@/components/shared/profile/force-password-change-dialog'
import { getProfilePathForRole } from '@/lib/role-labels'
import type { SessionUser } from '@/lib/session-shared'

type ProfileGateProps = {
  user: SessionUser | null
}

export function ProfileGate({ user }: ProfileGateProps) {
  if (!user?.mustChangePassword) {
    return null
  }

  return <ForcePasswordChangeDialog open profilePath={getProfilePathForRole(user.role)} />
}
