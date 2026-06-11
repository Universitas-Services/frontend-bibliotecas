import { CreateAgoraForm } from '@/components/admin/catalogo/create-agora-form'
import { FeatureUnavailableBanner } from '@/components/admin/feature-unavailable-banner'

export default function AdminAgoraPage() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <FeatureUnavailableBanner
        title="Listado maestro de Matriz B pendiente"
        description="Puede crear artículos de Ágora, pero el listado con control de publicidad activa/inactiva aún no está conectado al backend."
      />
      <CreateAgoraForm />
    </div>
  )
}
