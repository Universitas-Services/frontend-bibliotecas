import { listMatrizBAction, uploadMatrizBAction } from '@/app/actions/matrices'
import { MatrixUploadPanel } from '@/components/admin/catalogo/matrix-upload-panel'

export default async function AdminAgoraPage() {
  const result = await listMatrizBAction()
  const items = result.success ? result.data : []

  return (
    <MatrixUploadPanel
      title="Matriz B — Ágora"
      description="Suba la matriz de artículos de Ágora. Estos datos alimentan la vinculación documental en el flujo del curador."
      items={items}
      uploadAction={uploadMatrizBAction}
    />
  )
}
