import { EtiquetasPanel } from '@/components/admin/taxonomia/etiquetas-panel'
import { getEtiquetasAprobadasAction, getEtiquetasPendientesAction } from '@/app/actions/etiquetas'

export default async function AdminEtiquetasPage() {
  const [etiquetas, pendientes] = await Promise.all([
    getEtiquetasAprobadasAction(),
    getEtiquetasPendientesAction(),
  ])

  return <EtiquetasPanel etiquetas={etiquetas} pendientes={pendientes} />
}
