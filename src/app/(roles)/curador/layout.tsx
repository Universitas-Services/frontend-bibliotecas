import type { CSSProperties } from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { CuradorSidebar } from '@/components/curador/curador-sidebar'
import { CuradorHeader } from '@/components/curador/curador-header'

export default function CuradorLayout({ children }: { children: React.ReactNode }) {
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
        <CuradorSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <CuradorHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
