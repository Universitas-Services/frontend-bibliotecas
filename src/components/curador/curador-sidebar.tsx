'use client'

import { LayoutGrid, Folder, Wrench, Plus, Landmark, LogOut, PanelLeft } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'Panel de control',
    url: '/curador',
    icon: LayoutGrid,
  },
  {
    title: 'Gestión Documental',
    url: '/curador/gestion-documental',
    icon: Folder,
  },
  {
    title: 'Correcciones pendientes',
    url: '/curador/correcciones',
    icon: Wrench,
  },
]

/** Centra botones e iconos cuando el sidebar está colapsado (modo icon). */
const iconBtn =
  'group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:w-10! group-data-[collapsible=icon]:min-w-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!'

const iconMenu = 'group-data-[collapsible=icon]:items-center'

export function CuradorSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-border border-r bg-[#F8FAFC]">
      <SidebarHeader
        className={cn(
          'px-4 py-4',
          'group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pb-2',
        )}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-3 group-data-[collapsible=icon]:hidden">
          <div className="flex min-w-0 items-center gap-3 text-[#005496]">
            <Landmark className="h-8 w-8 shrink-0" strokeWidth={1.5} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-sans text-xl leading-tight font-bold tracking-tight">
                Universitas
              </span>
              <span className="mt-0.5 text-[10px] font-semibold tracking-widest text-[#00315C] uppercase">
                LEGAL ANALYST
              </span>
            </div>
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

        <SidebarMenu className={cn('mt-4 w-full', iconMenu)}>
          <SidebarMenuItem className={iconMenu}>
            <SidebarMenuButton
              asChild
              tooltip="Cargar nuevo documento"
              className={cn(
                'h-10 w-full bg-[#003D6F] font-medium text-white hover:bg-[#00315C] hover:text-white',
                iconBtn,
              )}
            >
              <Link href="/curador/nueva-carga" className="flex items-center gap-2">
                <Plus className="h-4 w-4 shrink-0" />
                <span className="truncate text-[12px] group-data-[collapsible=icon]:hidden">
                  Cargar nuevo documento
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
                const isActive =
                  pathname === item.url ||
                  (item.url === '/curador/gestion-documental' &&
                    pathname.startsWith('/curador/gestion-documental'))

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
              tooltip="Dr. Silva — CURADOR"
              className={cn('h-auto w-full py-2 hover:bg-transparent', iconBtn)}
            >
              <Avatar className="h-9 w-9 shrink-0 border border-gray-200">
                <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                <AvatarFallback className="bg-gray-800 text-xs text-white">DS</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium text-[#499DFE]">Dr. Silva</span>
                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  CURADOR
                </span>
              </div>
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
