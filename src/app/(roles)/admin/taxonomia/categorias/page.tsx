import { CategoriasPanel } from '@/components/admin/taxonomia/categorias-panel'
import { getCategoriasAdmin } from '@/app/actions/categorias'

export default async function AdminCategoriasPage() {
  const categorias = await getCategoriasAdmin()

  return <CategoriasPanel categorias={categorias} />
}
