'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function uploadDocumentAction(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      console.error('Error: No hay token de acceso')
      return
    }

    console.log('Enviando documento al backend...')
    const res = await fetch('https://biblioteca-legal-backend.onrender.com/documentos/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      console.error('Error del backend:', res.status, data)
      return
    }

    console.log('¡Documento cargado exitosamente!', data)
  } catch (error: unknown) {
    console.error('Error uploading document:', error)
    return
  }

  // Se hace redirect fuera del try/catch porque redirect arroja un error especial en Next.js
  redirect('/curador/gestion-documental')
}
