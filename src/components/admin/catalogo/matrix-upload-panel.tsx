'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { CloudUpload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { MatrizItem } from '@/lib/types/admin'

type MatrixUploadPanelProps = {
  title: string
  description: string
  items: MatrizItem[]
  uploadAction: (
    formData: FormData,
  ) => Promise<{ success: true; data: MatrizItem } | { success: false; error: string }>
  accept?: string
}

export function MatrixUploadPanel({
  title,
  description,
  items,
  uploadAction,
  accept = '.csv,.xlsx,.xls',
}: MatrixUploadPanelProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setFileName(selected.name)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast.error('Debe seleccionar un archivo para cargar.')
      return
    }

    const formData = new FormData()
    formData.set('file', file)

    startTransition(async () => {
      const result = await uploadAction(formData)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(`${title}: archivo cargado correctamente.`)
      setFile(null)
      setFileName(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-lg font-semibold text-[#00315C]">{title}</h2>
        <p className="mt-1 text-sm text-gray-500 italic">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-[#F8FAFC] p-10 text-center transition-colors hover:bg-gray-50">
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={isPending}
          />
          <CloudUpload
            className={`mb-4 h-12 w-12 ${fileName ? 'text-green-500' : 'text-gray-500'}`}
            strokeWidth={1.5}
          />
          <h3 className="mb-2 font-medium text-gray-800">
            {fileName ? fileName : 'Arrastra el archivo de matriz aquí o haz clic'}
          </h3>
          <p className="text-sm text-gray-500">Formatos: CSV, XLSX — Máx. 50MB</p>
        </label>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending || !file}
            className="bg-[#003D6F] hover:bg-[#00315C]"
          >
            {isPending ? 'Cargando...' : 'Subir matriz'}
          </Button>
        </div>
      </form>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-[#00315C]">Elementos cargados</h3>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay elementos en esta matriz.</p>
        ) : (
          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead>Fecha de carga</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="text-gray-600">{item.fileName}</TableCell>
                    <TableCell>{item.version ?? '—'}</TableCell>
                    <TableCell>
                      {new Date(item.uploadedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
