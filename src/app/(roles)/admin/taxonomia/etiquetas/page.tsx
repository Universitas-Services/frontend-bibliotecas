import { Brush, CheckSquare, LibrarySquare, PlusCircle, XSquare } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

export default function AdminEtiquetasPage() {
  return (
    <div className="flex h-full flex-col gap-8 p-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#00315C]">
          Gestión de etiquetas y motor semántico
        </h1>
        <p className="text-lg text-gray-500">
          Administración profunda de la taxonomía y herramientas de mantenimiento semántico.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          {/* Bandeja de resolución de sugerencias */}
          <Card className="flex flex-col p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#00315C]">
                Bandeja de resolución de sugerencias
              </h2>
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                4 pendientes
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] font-semibold text-gray-600">
                    Etiqueta sugerida
                  </TableHead>
                  <TableHead className="w-[40%] font-semibold text-gray-600">
                    Usuario proponente
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-600">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-gray-900">Derecho Espacial</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">Dr. Roberto Gómez</span>
                      <span className="text-xs text-gray-500">Curador senior</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-green-600 transition-colors hover:text-green-800">
                        <CheckSquare className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 transition-colors hover:text-red-700">
                        <XSquare className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-900">Derecho de la IA</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">Dr. Elena Marín</span>
                      <span className="text-xs text-gray-500">Revisora académica</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-green-600 transition-colors hover:text-green-800">
                        <CheckSquare className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 transition-colors hover:text-red-700">
                        <XSquare className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <a href="#" className="text-sm font-medium text-[#00315C] hover:underline">
                Ver todas las sugerencias
              </a>
            </div>
          </Card>

          {/* Crear nueva etiqueta */}
          <Card className="flex flex-col p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#00315C]">
              <PlusCircle className="h-5 w-5 text-[#00315C]" />
              Crear nueva etiqueta
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Nombre de la etiqueta</label>
                  <Input placeholder="Ej. Derecho Administrativo" className="h-10 bg-[#F8FAFC]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tipo o Categoría</label>
                  <Input placeholder="Subcategoría" className="h-10 bg-[#F8FAFC]" />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Descripción de la etiqueta
                </label>
                <Textarea
                  placeholder="Describa brevemente el alcance semántico de esta etiqueta..."
                  className="min-h-[108px] resize-none bg-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button className="bg-[#00315C] text-white hover:bg-[#002240]">Crear nueva</Button>
            </div>
          </Card>
        </div>

        {/* Consola de mantenimiento y limpieza */}
        <div className="flex flex-col lg:col-span-4">
          <Card className="overflow-hidden shadow-sm">
            <div className="bg-[#00315C] p-4 text-white">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Brush className="h-5 w-5" />
                Consola de mantenimiento y limpieza
              </h2>
            </div>

            <div className="flex flex-col gap-6 p-6">
              <p className="text-sm leading-relaxed text-gray-600">
                Use esta herramienta para consolidar términos duplicados o corregir desviaciones
                ortográficas en el índice.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Fusionar etiqueta A (Origen)
                  </label>
                  <Input placeholder="Ejemplo: Derecho Laboral" className="h-10 bg-[#F8FAFC]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Etiqueta B (Destino final)
                  </label>
                  <Input placeholder="Ejemplo: Derecho Laboral" className="h-10 bg-[#F8FAFC]" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full bg-[#00315C] text-white hover:bg-[#002240]">
                  Ejecutar fusión y limpiar índice
                </Button>
                <p className="text-center text-xs text-gray-500">
                  Esta acción afectará a 142 documentos vinculados.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Listado de etiquetas existentes */}
      <Card className="p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#00315C]">
          <LibrarySquare className="h-6 w-6" />
          Listado de etiquetas existentes
        </h2>

        <div className="rounded-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC]">
                <TableHead className="font-semibold text-gray-600">Nombre de etiquetas</TableHead>
                <TableHead className="font-semibold text-gray-600">Tipo de entrada</TableHead>
                <TableHead className="text-center font-semibold text-gray-600">
                  Documentos vinculados
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-600">Estado</TableHead>
                <TableHead className="text-center font-semibold text-gray-600">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-gray-900">Derecho Administrativo</TableCell>
                <TableCell className="text-gray-500">Categoría Principal</TableCell>
                <TableCell className="text-center text-gray-600">1,204</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Activo
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-gray-400">...</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-900">Impuesto sobre la Renta</TableCell>
                <TableCell className="text-gray-500">Subcategoría (Tributario)</TableCell>
                <TableCell className="text-center text-gray-600">432</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Activo
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-gray-400">...</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-900">Ley Seca</TableCell>
                <TableCell className="text-gray-500">Alias (Prohibición)</TableCell>
                <TableCell className="text-center text-gray-600">89</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700"
                  >
                    Revisión
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-gray-400">...</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
