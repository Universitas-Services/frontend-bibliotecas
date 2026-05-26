'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { createUserAction } from '@/app/actions/users'
import { FormCombobox } from '@/components/admin/form-combobox'
import { Button } from '@/components/ui/button'
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
  const [temaPrincipalId, setTemaPrincipalId] = useState('')

  const temaOptions = temas.map((t) => ({ value: t.id, label: t.nombre }))
  const showTema = requiresTemaPrincipal(rol)

  const handleRolChange = (value: string) => {
    const nextRol = value as AssignableRole | ''
    setRol(nextRol)
    if (!requiresTemaPrincipal(nextRol)) {
      setTemaPrincipalId('')
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
      temaPrincipalId: showTema ? temaPrincipalId : undefined,
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
    if (showTema && temaPrincipalId) {
      formData.set('temaPrincipalId', temaPrincipalId)
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
          <FormCombobox
            id="temaPrincipal"
            label="Tema principal"
            hint="Especialidad del revisor para el enrutamiento de documentos"
            options={temaOptions}
            value={temaPrincipalId}
            onValueChange={setTemaPrincipalId}
            placeholder="Seleccione un tema principal..."
            searchPlaceholder="Buscar tema..."
          />
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
