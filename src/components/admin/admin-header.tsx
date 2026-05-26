'use client'

import { usePathname } from 'next/navigation'

type HeaderConfig = {
  title: string
  subtitle?: string
}

const headerByPath: Record<string, HeaderConfig> = {
  '/admin/usuarios': {
    title: 'Gestión de usuarios',
    subtitle: 'Administre los usuarios de la plataforma y sus roles asignados.',
  },
  '/admin/usuarios/nuevo': {
    title: 'Crear nuevo usuario',
    subtitle:
      'Registre los datos del nuevo usuario, genere sus credenciales de acceso y asigne el rol que desempeñará dentro de la plataforma.',
  },
  '/admin/catalogo/productos': {
    title: 'Productos — Matriz A',
    subtitle: 'Cargue y administre los productos de formación de la Matriz A.',
  },
  '/admin/catalogo/agora': {
    title: 'Ágora — Matriz B',
    subtitle: 'Cargue y administre los artículos de Ágora de la Matriz B.',
  },
  '/admin/taxonomia/categorias': {
    title: 'Categorías',
    subtitle: 'Gestión de categorías de la taxonomía documental.',
  },
  '/admin/taxonomia/etiquetas': {
    title: 'Etiquetas',
    subtitle: 'Gestión de etiquetas de clasificación.',
  },
  '/admin/taxonomia/tipo-normas': {
    title: 'Tipo de normas',
    subtitle: 'Catálogo de tipos de normas aplicables.',
  },
  '/admin/soporte': { title: 'Soporte' },
  '/admin/acerca-de': { title: 'Acerca de' },
  '/admin/configuracion': { title: 'Configuración' },
}

export function AdminHeader() {
  const pathname = usePathname()
  const config = headerByPath[pathname]

  if (!config) return null

  return (
    <header className="border-b border-gray-200 bg-white px-8 py-6">
      <h1 className="text-2xl font-bold text-[#00315C]">{config.title}</h1>
      {config.subtitle ? (
        <p className="mt-2 max-w-3xl text-sm text-gray-500 italic">{config.subtitle}</p>
      ) : null}
    </header>
  )
}
