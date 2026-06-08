'use client'

import { Landmark, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { logoutAction } from '@/app/actions/auth'
import { adminNavSections } from '@/components/admin/admin-nav'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const iconBtn =
  'group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:w-10! group-data-[collapsible=icon]:min-w-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!'

const iconMenu = 'group-data-[collapsible=icon]:items-center'

const navLinkClass =
  'flex w-full items-center gap-2 text-inherit no-underline outline-none [&_svg]:text-current'

const menuButtonClass =
  'h-10 w-full text-white/90 hover:bg-white/10 hover:text-white data-active:bg-white/15 data-active:text-white'

function isNavActive(pathname: string, url: string) {
  if (url === '/admin/usuarios') {
    return pathname === '/admin/usuarios'
  }
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'border-[#002847]',
        '[&_[data-slot=sidebar-inner]]:bg-[#00315C]',
        '[&_[data-slot=sidebar-inner]]:text-white',
      )}
    >
      <SidebarHeader
        className={cn(
          'px-4 py-4',
          'group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2',
        )}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
          <SidebarTrigger
            className="h-9 w-9 shrink-0 border-transparent bg-transparent text-white hover:bg-white/10 hover:text-white"
            aria-label="Expandir o contraer menú"
          >
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <div className="flex min-w-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LOGO UNIVERSITAS LEGAL.png"
              alt="Universitas Legal"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        <div className="hidden w-full flex-col items-center gap-2 group-data-[collapsible=icon]:flex">
          <SidebarTrigger
            className={cn(
              'h-9 w-9 shrink-0 border-transparent bg-transparent text-white hover:bg-white/10 hover:text-white',
              iconBtn,
            )}
            aria-label="Expandir o contraer menú"
          >
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <Landmark className="h-7 w-7 shrink-0 text-white" strokeWidth={1.5} />
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          'px-2',
          'group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0',
        )}
      >
        {adminNavSections.map((section, index) => (
          <SidebarGroup key={section.label} className="w-full group-data-[collapsible=icon]:w-auto">
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-wider text-white/55 uppercase group-data-[collapsible=icon]:sr-only">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className={cn('gap-0.5', iconMenu)}>
                {section.items.map((item) => {
                  const active = isNavActive(pathname, item.url)
                  return (
                    <SidebarMenuItem key={item.url} className={iconMenu}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={cn(menuButtonClass, iconBtn)}
                      >
                        <Link href={item.url} className={navLinkClass}>
                          <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {index < adminNavSections.length - 1 ? (
              <SidebarSeparator className="my-2 bg-white/15 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />
            ) : null}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter
        className={cn(
          'p-4',
          'group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2',
        )}
      >
        <p className="mb-3 text-[9px] leading-snug text-white/45 group-data-[collapsible=icon]:hidden">
          Copyright © 2023 Universitas Services | GESTOR CONTRATACIONES
        </p>
        <SidebarMenu className={iconMenu}>
          <SidebarMenuItem className={iconMenu}>
            <form action={logoutAction} className="flex w-full justify-center">
              <SidebarMenuButton
                type="submit"
                tooltip="Cerrar sesión"
                className={cn(
                  'w-full text-white/70 hover:bg-white/10 hover:text-white data-active:bg-white/10 data-active:text-white',
                  iconBtn,
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Cerrar sesión</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
