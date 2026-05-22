'use server'

import { cookies } from 'next/headers'

export async function uploadDocumentAction(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return { error: 'No autorizado. Inicie sesión nuevamente.' }
    }

    const res = await fetch('https://biblioteca-legal-backend.onrender.com/documentos/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return { error: data?.message || 'Error del backend al cargar el documento.' }
    }

    return { success: true, data }
  } catch {
    return { error: 'Error de conexión con el servidor.' }
  }
}

export async function getDocumentsAction() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return { success: false, error: 'No autorizado. Inicie sesión nuevamente.' }
    }

    const res = await fetch('https://biblioteca-legal-backend.onrender.com/documentos', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      console.error('Error al obtener documentos:', res.status, data)
      return { success: false, error: 'Error al obtener los documentos.' }
    }

    return { success: true, data }
  } catch {
    return { success: false, error: 'Error de conexión.' }
  }
}

export async function getPreviewUrlAction(documentId: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return { success: false, error: 'No autorizado. Inicie sesión nuevamente.' }
    }

    const res = await fetch(
      `https://biblioteca-legal-backend.onrender.com/documentos/${documentId}/preview`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      },
    )

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return { success: false, error: data?.message || 'Error al obtener la previsualización.' }
    }

    return { success: true, url: data.url }
  } catch {
    return { success: false, error: 'Error de conexión.' }
  }
}

export async function getDocumentByIdAction(documentId: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return { success: false, error: 'No autorizado. Inicie sesión nuevamente.' }
    }

    const res = await fetch(
      `https://biblioteca-legal-backend.onrender.com/documentos/${documentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      },
    )

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return { success: false, error: data?.message || 'Error al obtener el documento.' }
    }

    return { success: true, data }
  } catch {
    return { success: false, error: 'Error de conexión.' }
  }
}
