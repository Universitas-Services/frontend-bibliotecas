'use client'

import * as React from 'react'
import { Search, Bell, History, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function CuradorHeader() {
  return (
    <header className="border-border sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <div className="relative w-full max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search archive..."
            className="focus-visible:ring-ring h-10 w-full border-none bg-zinc-50/50 pl-9 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-muted-foreground flex items-center gap-4">
          <button className="hover:text-primary transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="hover:text-primary transition-colors">
            <History className="h-5 w-5" />
          </button>
          <button className="hover:text-primary transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-border mx-2 h-8 w-[1px]" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 transition-opacity outline-none hover:opacity-80">
              <div className="flex flex-col items-end text-right">
                <span className="text-sm font-bold">Verónica / Marivi</span>
                <span className="text-muted-foreground text-[11px]">Account Settings</span>
              </div>
              <Avatar className="border-border h-9 w-9 border">
                <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                <AvatarFallback>VM</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Ajustes</DropdownMenuItem>
            <DropdownMenuItem>Soporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
