"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { name: "Nueva Carga", href: "/curador/nueva-carga" },
  { name: "Mis Cargas", href: "/curador/mis-cargas" },
  { name: "Borradores", href: "/curador/borradores" },
]

export function CuradorTabs() {
  const pathname = usePathname()

  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-all relative",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            {tab.name}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
