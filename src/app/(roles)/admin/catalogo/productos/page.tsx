import { listMatrizAAction, uploadMatrizAAction } from '@/app/actions/matrices'
import { MatrixUploadPanel } from '@/components/admin/catalogo/matrix-upload-panel'

export default async function AdminProductosPage() {
  const result = await listMatrizAAction()
  const items = result.success ? result.data : []

  return (
    <MatrixUploadPanel
      title="Matriz A — Productos"
      description="Suba el catálogo de productos de formación. Estos datos alimentan la selección del curador al cargar documentos."
      items={items}
      uploadAction={uploadMatrizAAction}
    />
  )
}
