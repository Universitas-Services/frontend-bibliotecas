'use client'

import * as React from 'react'
import { LayoutGrid, Folder, Wrench, Plus, Landmark, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

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
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'Panel de control',
    url: '/curador',
    icon: LayoutGrid,
  },
  {
    title: 'Gestión de documentos',
    url: '/curador/documentos',
    icon: Folder,
  },
  {
    title: 'Correcciones pendientes',
    url: '/curador/correcciones',
    icon: Wrench,
  },
]

export function CuradorSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-border border-r bg-[#F8FAFC]">
      <SidebarHeader className="px-6 py-6">
        <div className="mb-6 flex items-center gap-3 text-[#005496]">
          <Landmark className="h-8 w-8" strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="font-sans text-xl leading-tight font-bold tracking-tight">
              Universitas
            </span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-widest text-[#00315C] uppercase">
              LEGAL ANALYST
            </span>
          </div>
        </div>

        <div className="mt-2">
          <Button
            asChild
            className="h-10 w-full justify-start gap-2 rounded-md bg-[#003D6F] px-4 text-white shadow-none hover:bg-[#00315C]"
          >
            <Link href="/curador/nueva-carga">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Cargar nuevo documento</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                // Determine active state, making /curador/nueva-carga active for "Gestión de documentos" just as an example if needed, or keeping it strict.
                const isActive =
                  pathname === item.url ||
                  (item.url === '/curador/documentos' && pathname.includes('nueva-carga'))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        'h-10 px-3 transition-colors',
                        isActive
                          ? 'bg-transparent font-medium text-[#005496]'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-[#005496]',
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={cn('h-4 w-4', isActive ? 'text-[#005496]' : 'text-gray-500')}
                          strokeWidth={isActive ? 2 : 1.5}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4">
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-gray-200">
              <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
              <AvatarFallback className="bg-gray-800 text-xs text-white">DS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#499DFE]">Dr. Silva</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                CURADOR
              </span>
            </div>
          </div>
          <button className="text-gray-400 transition-colors hover:text-gray-700">
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
