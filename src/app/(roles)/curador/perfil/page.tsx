import { ProfilePageContent } from '@/components/shared/profile/profile-page-content'
import { getSessionUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function CuradorPerfilPage() {
  const session = await getSessionUser()

  if (session.sessionInvalid) {
    redirect('/login?logout=1')
  }

  if (!session.user) {
    redirect('/login')
  }

  return <ProfilePageContent user={session.user} />
}
