import type { LucideIcon } from 'lucide-react'
import { Mail, MapPin, Phone, Shield, Tag } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getRoleLabel } from '@/lib/role-labels'
import { formatSessionDisplayName, type SessionUser } from '@/lib/session-shared'

type ProfileOverviewProps = {
  user: SessionUser
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#005496] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const displayName = formatSessionDisplayName(user)
  const roleLabel = getRoleLabel(user.role)

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 border-2 border-[#005496]/20">
            <AvatarFallback className="bg-[#00315C] text-lg text-white">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-2xl text-[#0F1D30]">{displayName}</CardTitle>
            <CardDescription className="mt-1 text-base text-slate-500">
              {user.email}
            </CardDescription>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-[#D4E4FA] text-[#005496] hover:bg-[#D4E4FA]">{roleLabel}</Badge>
              {user.mustChangePassword ? (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                  Contraseña temporal pendiente
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <ProfileField icon={Mail} label="Correo electrónico" value={user.email} />
        <ProfileField icon={Shield} label="Rol en la plataforma" value={roleLabel} />
        <ProfileField icon={Phone} label="Teléfono" value={user.telefono || 'No registrado'} />
        <ProfileField icon={MapPin} label="País" value={user.pais || 'No registrado'} />
        {user.temasAsignados && user.temasAsignados.length > 0 ? (
          <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-4 sm:col-span-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#005496] shadow-sm">
              <Tag className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Temas asignados
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.temasAsignados.map((tema) => (
                  <Badge key={tema.id} variant="secondary">
                    {tema.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
