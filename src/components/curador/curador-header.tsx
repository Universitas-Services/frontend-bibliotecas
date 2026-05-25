'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Breadcrumb = { label: string; href?: string; current?: boolean }

type HeaderConfig = {
  breadcrumbs: Breadcrumb[]
  title: string
  subtitle?: string
  showSearch?: boolean
  actions?: 'nueva-carga' | null
}

function getHeaderConfig(pathname: string): HeaderConfig | null {
  if (pathname === '/curador') return null
  if (pathname.startsWith('/curador/correcciones')) return null

  if (pathname === '/curador/gestion-documental') {
    return {
      breadcrumbs: [{ label: 'PLATAFORMA' }, { label: 'GESTIÓN DOCUMENTAL', current: true }],
      title: 'Mis Documentos',
      subtitle:
        'Historial completo de documentos cargados a la plataforma para su procesamiento legal.',
      showSearch: true,
    }
  }

  if (pathname === '/curador/nueva-carga') {
    return {
      breadcrumbs: [
        { label: 'Nueva carga', href: '/curador/nueva-carga' },
        { label: 'Nuevo documento' },
      ],
      title: 'Ingesta y clasificación avanzada',
      actions: 'nueva-carga',
    }
  }

  return null
}

export function CuradorHeader() {
  const pathname = usePathname()
  const config = getHeaderConfig(pathname)

  if (!config) return null

  return (
    <header className="sticky top-0 z-10 flex flex-col justify-center border-b border-gray-200 bg-white px-6 py-4 md:px-8">
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#C1C7D2] uppercase">
            {config.breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <span>{'>'}</span>}
                {crumb.href && !crumb.current ? (
                  <Link href={crumb.href} className="transition-colors hover:text-[#0F1D30]">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={crumb.current ? 'text-[#0F1D30]' : undefined}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </div>

          <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#00315C] md:text-[28px]">
            {config.title}
          </h1>
          {config.subtitle ? (
            <p className="text-[14px] font-semibold text-[#6B7280]">{config.subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {config.showSearch ? (
            <div className="relative w-full md:w-[320px]">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-[#C1C7D2]" />
              <Input
                placeholder="Buscar expediente o ID..."
                className="h-10 rounded-md border-[#0F1D30] bg-[#0F1D30] pl-9 text-[13px] font-medium text-white placeholder:text-[#6B7280] focus-visible:ring-1 focus-visible:ring-[#499DFE]"
              />
            </div>
          ) : null}

          {config.actions === 'nueva-carga' ? (
            <>
              <Button
                variant="outline"
                className="h-10 border-gray-300 px-6 font-medium text-gray-600 hover:bg-gray-50"
              >
                Guardar borrador
              </Button>
              <Button
                type="submit"
                form="nueva-carga-form"
                className="h-10 bg-[#003D6F] px-6 font-medium text-white shadow-sm hover:bg-[#00315C]"
              >
                Publicar documento
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
