import { CreateProductForm } from '@/components/admin/catalogo/create-product-form'
import { FeatureUnavailableBanner } from '@/components/admin/feature-unavailable-banner'

export default function AdminProductosPage() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <FeatureUnavailableBanner
        title="Listado maestro de Matriz A pendiente"
        description="Puede crear productos de formación, pero el listado con control de publicidad activa/inactiva aún no está conectado al backend."
      />
      <CreateProductForm />
    </div>
  )
}
