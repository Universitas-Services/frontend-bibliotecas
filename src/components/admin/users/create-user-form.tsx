'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { createUserAction } from '@/app/actions/users'
import { FormCombobox } from '@/components/admin/form-combobox'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requiresTemaPrincipal, validateCreateUserInput } from '@/lib/admin-validation'
import { ROLE_LABELS } from '@/lib/mocks/admin-store'
import type { AssignableRole, TemaPrincipal } from '@/lib/types/admin'

type CreateUserFormProps = {
  temas: TemaPrincipal[]
}

const roleOptions = (Object.keys(ROLE_LABELS) as AssignableRole[]).map((rol) => ({
  value: rol,
  label: ROLE_LABELS[rol],
}))

export function CreateUserForm({ temas }: CreateUserFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState<AssignableRole | ''>('')
  const [temaIds, setTemaIds] = useState<string[]>([])

  const showTema = requiresTemaPrincipal(rol)

  const handleRolChange = (value: string) => {
    const nextRol = value as AssignableRole | ''
    setRol(nextRol)
    if (!requiresTemaPrincipal(nextRol)) {
      setTemaIds([])
    }
  }

  const toggleTema = (id: string) => {
    setTemaIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const toggleTodosTemas = () => {
    if (temaIds.length === temas.length) {
      setTemaIds([])
    } else {
      setTemaIds(temas.map((t) => t.id))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const input = {
      nombre,
      apellido,
      email,
      password,
      rol: rol as AssignableRole,
      temaIds: showTema ? temaIds : undefined,
    }

    const validationError = validateCreateUserInput(input)
    if (validationError) {
      toast.error(validationError)
      return
    }

    const formData = new FormData()
    formData.set('nombre', nombre)
    formData.set('apellido', apellido)
    formData.set('email', email)
    formData.set('password', password)
    formData.set('rol', rol)
    if (showTema && temaIds.length > 0) {
      formData.set('temaIds', JSON.stringify(temaIds))
    }

    startTransition(async () => {
      const result = await createUserAction(formData)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Usuario creado correctamente.')
      router.push('/admin/usuarios')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 p-8">
      <div className="space-y-6 border-b border-gray-200 pb-8">
        <FormField
          id="nombre"
          label="Nombre del usuario"
          hint="Ejemplo: Pedro José"
          value={nombre}
          onChange={setNombre}
        />
        <FormField
          id="apellido"
          label="Apellido del usuario"
          hint="Ejemplo: Rodriguez Hernández"
          value={apellido}
          onChange={setApellido}
        />
        <FormField
          id="email"
          label="Correo electrónico"
          hint="Ejemplo: ejemplo@dominio.com"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <FormField
          id="password"
          label="Contraseña temporal"
          hint="Validación: Mínimo 8 caracteres, debe incluir una mayúscula y un carácter especial Ejemplo: A123456*"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <FormCombobox
          id="rol"
          label="Asignar Rol en la plataforma"
          hint="Seleccione el rol que desempeñará el usuario"
          options={roleOptions}
          value={rol}
          onValueChange={handleRolChange}
          placeholder="Asignar Rol"
          searchPlaceholder="Buscar rol..."
        />

        {showTema ? (
          <div className="space-y-3">
            <Label className="text-sm font-bold text-[#00315C]">Temas principales asignados</Label>
            <p className="text-xs text-gray-500 italic">
              Seleccione uno o varios temas. Puede seleccionar todos.
            </p>
            <div className="space-y-3 rounded-md border border-gray-200 bg-slate-50 p-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                <Checkbox
                  id="select-all"
                  checked={temaIds.length === temas.length && temas.length > 0}
                  onCheckedChange={toggleTodosTemas}
                />
                <label
                  htmlFor="select-all"
                  className="cursor-pointer text-sm leading-none font-medium"
                >
                  Seleccionar todos
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
                {temas.map((tema) => (
                  <div key={tema.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`tema-${tema.id}`}
                      checked={temaIds.includes(tema.id)}
                      onCheckedChange={() => toggleTema(tema.id)}
                    />
                    <label
                      htmlFor={`tema-${tema.id}`}
                      className="cursor-pointer text-sm leading-none"
                    >
                      {tema.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 min-w-[140px] bg-[#003D6F] px-8 hover:bg-[#00315C]"
        >
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}

function FormField({
  id,
  label,
  hint,
  value,
  onChange,
  type = 'text',
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-bold text-[#00315C]">
        {label}
      </Label>
      {hint ? <p className="text-xs text-gray-500 italic">{hint}</p> : null}
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 border-gray-300"
      />
    </div>
  )
}
