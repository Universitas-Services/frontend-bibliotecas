"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Library,
  ClipboardCheck,
  BarChart3,
  Star,
  Settings,
  HelpCircle,
  Plus,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    url: "/curador/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Library",
    url: "/curador/library",
    icon: Library,
  },
  {
    title: "Review Queue",
    url: "/curador/review-queue",
    icon: ClipboardCheck,
  },
  {
    title: "Analytics",
    url: "/curador/analytics",
    icon: BarChart3,
  },
  {
    title: "Favorites",
    url: "/curador/favorites",
    icon: Star,
  },
]

const footerItems = [
  {
    title: "Settings",
    url: "/curador/settings",
    icon: Settings,
  },
  {
    title: "Support",
    url: "/curador/support",
    icon: HelpCircle,
  },
]

export function CuradorSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white font-bold">
            L
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">biblioteca Legal</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Institutional Authority</span>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            asChild
            className="w-full justify-start gap-2 bg-[#008f5d] hover:bg-[#007a4f] text-white rounded-md h-10 px-4"
          >
            <Link href="/curador/nueva-carga">
              <Plus className="h-4 w-4" />
              <span>Upload Document</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      "h-10 transition-colors",
                      pathname === item.url 
                        ? "bg-white shadow-sm border border-border text-primary font-semibold" 
                        : "text-muted-foreground hover:text-primary hover:bg-sidebar-accent"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4", pathname === item.url ? "text-primary" : "text-muted-foreground")} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-6 border-t border-sidebar-border">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className="h-10 text-muted-foreground hover:text-primary hover:bg-sidebar-accent transition-colors"
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
