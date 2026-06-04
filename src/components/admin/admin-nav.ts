import type { LucideIcon } from 'lucide-react'
import {
  Boxes,
  Gavel,
  GitBranch,
  Info,
  Newspaper,
  Settings,
  Tag,
  UserCog,
  Users,
  Headset,
  Network,
} from 'lucide-react'

export type AdminNavItem = {
  title: string
  url: string
  icon: LucideIcon
}

export type AdminNavSection = {
  label: string
  items: AdminNavItem[]
}

export const adminNavSections: AdminNavSection[] = [
  {
    label: 'Administración',
    items: [
      { title: 'Usuarios', url: '/admin/usuarios', icon: Users },
      { title: 'Crear usuario', url: '/admin/usuarios/nuevo', icon: UserCog },
    ],
  },
  {
    label: 'Catálogo comercial',
    items: [
      { title: 'Productos', url: '/admin/catalogo/productos', icon: Newspaper },
      { title: 'Ágora', url: '/admin/catalogo/agora', icon: GitBranch },
    ],
  },
  {
    label: 'Taxonomía',
    items: [
      { title: 'Temas', url: '/admin/taxonomia/temas', icon: Network },
      { title: 'Tipos de documentos', url: '/admin/taxonomia/tipo-documentos', icon: Newspaper },
      { title: 'Tipo de normas', url: '/admin/taxonomia/tipo-normas', icon: Gavel },
      { title: 'Categorías', url: '/admin/taxonomia/categorias', icon: Boxes },
      { title: 'Etiquetas', url: '/admin/taxonomia/etiquetas', icon: Tag },
    ],
  },
  {
    label: 'Otros Servicios',
    items: [
      { title: 'Soporte', url: '/admin/soporte', icon: Headset },
      { title: 'Acerca de', url: '/admin/acerca-de', icon: Info },
      { title: 'Configuración', url: '/admin/configuracion', icon: Settings },
    ],
  },
]
