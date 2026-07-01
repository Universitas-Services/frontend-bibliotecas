import type { CSSProperties } from 'react'
import { redirect } from 'next/navigation'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CuradorSidebar } from '@/components/curador/curador-sidebar'
import { CuradorHeader } from '@/components/curador/curador-header'
import { getSessionUser } from '@/lib/session'

export default async function CuradorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser()

  if (session.sessionInvalid) {
    redirect('/login?logout=1')
  }

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-icon': '5rem',
          } as CSSProperties
        }
      >
        <div className="flex min-h-screen w-full bg-zinc-50/50">
          <CuradorSidebar user={session.user} />
          <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            <CuradorHeader />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
