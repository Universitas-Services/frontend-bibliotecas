import { getBandejaRevisorAction } from '@/app/actions/workflows'
import { RevisorDocumentList } from '@/components/revisor/revisor-document-list'

export const dynamic = 'force-dynamic'

export default async function RevisorPage() {
  const result = await getBandejaRevisorAction()

  // If there's an error, we'll pass an empty array or handle it gracefully
  const documents = result.success && Array.isArray(result.data) ? result.data : []

  return (
    <div className="pb-12">
      <div className="mt-6 px-6 md:px-8">
        <p className="text-sm text-gray-600">
          Revisa y aprueba los documentos cargados por los curadores. Los documentos aprobados serán
          publicados y los rechazados serán devueltos.
        </p>
      </div>

      <RevisorDocumentList documents={documents} />
    </div>
  )
}
