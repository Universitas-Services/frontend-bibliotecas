import type { CSSProperties } from 'react'
import { redirect } from 'next/navigation'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { RevisorSidebar } from '@/components/revisor/revisor-sidebar'
import { getSessionUser } from '@/lib/session'

export default async function RevisorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser()

  if (session.sessionInvalid) {
    redirect('/login?logout=1&authReason=profile')
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--sidebar-width-icon': '5rem',
        } as CSSProperties
      }
    >
      <div className="flex min-h-screen w-full bg-zinc-50/50">
        <RevisorSidebar user={session.user} />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          {/* Un header simple para el revisor si no hay uno específico */}
          <header className="sticky top-0 z-10 flex flex-col justify-center border-b border-gray-200 bg-white px-6 py-4 md:px-8">
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#00315C] md:text-[28px]">
              Panel de Revisión
            </h1>
            <p className="text-[14px] font-semibold text-[#6B7280]">
              Gestión y aprobación de documentos
            </p>
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
