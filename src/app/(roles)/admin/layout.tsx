import type { CSSProperties } from 'react'
import { redirect } from 'next/navigation'

import { AdminHeader } from '@/components/admin/admin-header'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getSessionUser } from '@/lib/session'

const adminSidebarTheme = {
  '--sidebar-width': '16rem',
  '--sidebar-width-icon': '4rem',
  '--sidebar': '#00315C',
  '--sidebar-foreground': '#ffffff',
  '--sidebar-primary': '#ffffff',
  '--sidebar-primary-foreground': '#00315C',
  '--sidebar-accent': 'rgba(255, 255, 255, 0.12)',
  '--sidebar-accent-foreground': '#ffffff',
  '--sidebar-border': '#004a7c',
  '--sidebar-ring': '#499DFE',
} as CSSProperties

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser()

  if (session.sessionInvalid) {
    redirect('/login?logout=1&authReason=profile')
  }

  return (
    <SidebarProvider style={adminSidebarTheme}>
      <div className="flex min-h-screen w-full bg-zinc-50/50">
        <AdminSidebar user={session.user} />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-white">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
