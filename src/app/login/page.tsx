import { LoginForm } from './login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Universitas',
  description: 'Portal exclusivo para equipo interno',
}

export default function LoginPage() {
  return <LoginForm />
}
