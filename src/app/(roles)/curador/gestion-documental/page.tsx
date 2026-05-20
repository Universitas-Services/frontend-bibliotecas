import { DocumentFilters } from '@/components/curador/gestion-documental/document-filters'
import { DocumentList } from '@/components/curador/gestion-documental/document-list'
import { DocumentPagination } from '@/components/curador/gestion-documental/document-pagination'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function GestionDocumentalPage() {
  return (
    <div className="animate-in fade-in mx-auto w-full max-w-[1400px] p-6 duration-500 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-6 border-b border-[#E5E7EB] pb-6 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#C1C7D2] uppercase">
            <span>PLATAFORMA</span>
            <span>{'>'}</span>
            <span className="text-[#0F1D30]">GESTIÓN DOCUMENTAL</span>
          </div>
          <h1 className="mb-2 font-['Space_Grotesk'] text-[28px] font-bold tracking-tight text-[#00315C]">
            Mis Documentos
          </h1>
          <p className="text-[14px] font-semibold text-[#6B7280]">
            Historial completo de documentos cargados a la plataforma para su procesamiento legal.
          </p>
        </div>

        <div className="relative w-full md:w-[320px]">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-[#C1C7D2]" />
          <Input
            placeholder="Buscar expediente o ID..."
            className="h-10 rounded-md border-[#0F1D30] bg-[#0F1D30] pl-9 text-[13px] font-medium text-white placeholder:text-[#6B7280] focus-visible:ring-1 focus-visible:ring-[#499DFE]"
          />
        </div>
      </div>

      {/* Filters */}
      <DocumentFilters />

      {/* Document List */}
      <DocumentList />

      {/* Pagination */}
      <DocumentPagination />
    </div>
  )
}
