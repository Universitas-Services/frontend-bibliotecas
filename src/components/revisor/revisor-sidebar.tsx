'use client'

import { LayoutGrid, Folder, CheckSquare, LogOut, PanelLeft, Landmark } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { getProfilePathForRole } from '@/lib/role-labels'
import { formatSessionDisplayName, type SessionUser } from '@/lib/session-shared'

const navItems = [
  {
    title: 'Bandeja de Revisión',
    url: '/revisor',
    icon: CheckSquare,
  },
]

const iconBtn =
  'group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:w-10! group-data-[collapsible=icon]:min-w-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!'

const iconMenu = 'group-data-[collapsible=icon]:items-center'

type RevisorSidebarProps = {
  user?: SessionUser | null
}

export function RevisorSidebar({ user }: RevisorSidebarProps) {
  const pathname = usePathname()
  const displayName = formatSessionDisplayName(user)
  const roleLabel = user?.role || 'REVISOR'
  const initials = user?.initials || 'RE'
  const profilePath = getProfilePathForRole(roleLabel)

  return (
    <Sidebar collapsible="icon" className="border-border border-r bg-[#F8FAFC]">
      <SidebarHeader
        className={cn(
          'px-4 py-4',
          'group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pb-2',
        )}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-3 group-data-[collapsible=icon]:hidden">
          <div className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LOGO UNIVERSITAS LEGAL.png"
              alt="Universitas Legal Analyst"
              className="h-10 w-auto object-contain opacity-90 brightness-0 invert"
            />
          </div>
          <SidebarTrigger
            className="h-9 w-9 shrink-0 text-gray-600 hover:bg-gray-100 hover:text-[#005496]"
            aria-label="Expandir o contraer menú"
          >
            <PanelLeft className="h-5 w-5" />
          </SidebarTrigger>
        </div>

        <div className="hidden w-full flex-col items-center gap-3 group-data-[collapsible=icon]:flex">
          <Landmark className="h-8 w-8 shrink-0 text-[#005496]" strokeWidth={1.5} />
          <SidebarTrigger
            className={cn(
              'h-9 w-9 shrink-0 text-gray-600 hover:bg-gray-100 hover:text-[#005496]',
              iconBtn,
            )}
            aria-label="Expandir o contraer menú"
          >
            <PanelLeft className="h-5 w-5" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          'px-2',
          'group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0',
        )}
      >
        <SidebarGroup className="w-full group-data-[collapsible=icon]:w-auto">
          <SidebarGroupContent>
            <SidebarMenu className={cn('gap-1', iconMenu)}>
              {navItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.title} className={iconMenu}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        'h-10 w-full transition-colors',
                        iconBtn,
                        isActive
                          ? 'bg-transparent font-medium text-[#005496]'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-[#005496]',
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isActive ? 'text-[#005496]' : 'text-gray-500',
                          )}
                          strokeWidth={isActive ? 2 : 1.5}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          'p-4',
          'group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2',
        )}
      >
        <SidebarMenu className={iconMenu}>
          <SidebarMenuItem className={iconMenu}>
            <SidebarMenuButton
              asChild
              tooltip={`Ver perfil — ${displayName}`}
              className={cn(
                'h-auto w-full py-2 hover:bg-gray-100',
                pathname === profilePath && 'bg-gray-100',
                iconBtn,
              )}
            >
              <Link href={profilePath} className="flex items-center gap-2">
                <Avatar className="h-9 w-9 shrink-0 border border-gray-200">
                  <AvatarFallback className="bg-gray-800 text-xs text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium text-[#499DFE]">{displayName}</span>
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    {roleLabel}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className={iconMenu}>
            <form action={logoutAction} className="flex w-full justify-center">
              <SidebarMenuButton
                type="submit"
                tooltip="Cerrar sesión"
                className={cn(
                  'w-full text-gray-400 hover:bg-gray-100 hover:text-gray-700',
                  iconBtn,
                )}
              >
                <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                <span className="group-data-[collapsible=icon]:hidden">Cerrar sesión</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
