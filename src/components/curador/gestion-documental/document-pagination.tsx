'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type DocumentPaginationProps = {
  page: number
  limit: number
  total: number
  totalPages: number
  basePath?: string
}

export function DocumentPagination({
  page,
  limit,
  total,
  totalPages,
  basePath = '/curador/gestion-documental',
}: DocumentPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  if (total === 0) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(nextPage))
    }
    const query = params.toString()
    startTransition(() => {
      router.push(query ? `${basePath}?${query}` : basePath)
    })
  }

  const visiblePages = buildVisiblePages(page, totalPages)

  return (
    <div className="mt-8 flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
      <p className="text-[13px] font-semibold text-[#6B7280]">
        Mostrando {start}-{end} de {total} documentos
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md border-[#C1C7D2] bg-white text-[#6B7280]"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((item, index) =>
          item === '...' ? (
            <div key={`ellipsis-${index}`} className="px-2 text-sm font-bold text-[#6B7280]">
              ...
            </div>
          ) : (
            <Button
              key={item}
              variant="outline"
              className={`h-9 w-9 rounded-md px-0 font-bold ${
                item === page
                  ? 'border-[#005496] bg-[#D4E4FA]/30 text-[#005496]'
                  : 'border-[#C1C7D2] bg-white text-[#404551] hover:bg-[#F3F4F6]'
              }`}
              onClick={() => goToPage(item)}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-md border-[#C1C7D2] bg-white text-[#404551] hover:bg-[#F3F4F6]"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function buildVisiblePages(current: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < totalPages - 2) pages.push('...')

  pages.push(totalPages)
  return pages
}
