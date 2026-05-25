import Link from 'next/link'

import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

type RolePlaceholderProps = {
  title: string
  description: string
}

export function RolePlaceholder({ title, description }: RolePlaceholderProps) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="max-w-lg text-gray-600">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <form action={logoutAction}>
          <Button type="submit" variant="outline">
            Cerrar sesión
          </Button>
        </form>
        <Button asChild variant="ghost">
          <Link href="/login?logout=1">Usar otra cuenta</Link>
        </Button>
      </div>
    </div>
  )
}
