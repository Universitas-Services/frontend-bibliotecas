import { DocumentFilters } from '@/components/curador/gestion-documental/document-filters'
import { DocumentList } from '@/components/curador/gestion-documental/document-list'
import { DocumentPagination } from '@/components/curador/gestion-documental/document-pagination'

export default function GestionDocumentalPage() {
  return (
    <div className="animate-in fade-in mx-auto w-full max-w-[1400px] p-6 duration-500 md:p-8">
      <DocumentFilters />
      <DocumentList />
      <DocumentPagination />
    </div>
  )
}
