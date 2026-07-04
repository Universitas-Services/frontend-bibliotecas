import { CategoriasPanel } from '@/components/admin/taxonomia/categorias-panel'
import { getCategoriasAdmin, getCategoriasPendientesAction } from '@/app/actions/categorias'

export default async function AdminCategoriasPage() {
  const [categorias, pendientes] = await Promise.all([
    getCategoriasAdmin(),
    getCategoriasPendientesAction(),
  ])

  return <CategoriasPanel categorias={categorias} pendientes={pendientes} />
}
