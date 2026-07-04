/**
 * Mensajes orientados al usuario final — español claro, sin jerga técnica.
 * Usar en toasts, pantallas de error y respuestas de acciones server.
 */

export const USER_MSG = {
  common: {
    sessionExpired: 'Su sesión expiró. Inicie sesión nuevamente.',
    notAuthorized: 'No tiene autorización para realizar esta acción.',
    connection: 'No pudimos conectar con el servidor. Compruebe su conexión e intente de nuevo.',
    timeout: 'El servidor tardó demasiado en responder. Intente nuevamente en unos segundos.',
    unknown: 'Ocurrió un error inesperado. Intente nuevamente.',
    tryAgainLater:
      'Intente nuevamente en unos minutos. Si el problema continúa, contacte al administrador.',
  },
  validation: {
    requiredFields: 'Complete los campos obligatorios antes de continuar.',
    selectFile: 'Seleccione un archivo PDF o Word antes de continuar.',
    selectFilePublish: 'Seleccione un archivo PDF o Word antes de publicar.',
    selectFileDraft: 'Seleccione un archivo PDF o Word antes de guardar el borrador.',
    noteContent: 'Escriba el contenido de la nota.',
    rejectionReason: 'Indique el motivo del rechazo.',
    rejectionReasonMin: 'El motivo del rechazo debe tener al menos 10 caracteres.',
    temaName: 'Ingrese el nombre del tema.',
    temaRequired: 'Seleccione un tema principal.',
    tipoDocumentoRequired: 'Seleccione un tipo documental.',
    instrumentoName: 'Ingrese el nombre del instrumento (tipo de norma).',
    estadoLegal: 'Seleccione un estado legal válido.',
    reformaLey: 'Seleccione la ley original que está siendo reformada.',
    reformaEditUnavailable: 'La edición como reforma aún no está disponible. Cree una nueva carga.',
    classification: 'Complete la clasificación del documento antes de continuar.',
    tituloIntegroRequired: 'El título oficial es obligatorio.',
    nombreBreveRequired: 'El nombre breve es obligatorio.',
    categorias: 'Asigne al menos una categoría antes de continuar.',
    loginCredentials: 'Ingrese su correo y contraseña.',
    uploadFile: 'Seleccione un archivo para cargar.',
    fileTooLarge: 'El archivo supera el límite de 32 MB permitido por el servidor.',
  },
  preview: {
    title: 'No pudimos mostrar el documento',
    description:
      'La vista previa no está disponible en este momento. Los datos del documento se cargaron correctamente.',
    unavailable:
      'El archivo no puede previsualizarse ahora. Estamos trabajando para restablecer el acceso. Intente más tarde.',
  },
  success: {
    documentUploaded: 'Documento cargado correctamente.',
    documentUpdated: 'Documento actualizado correctamente.',
    documentCorrected: 'Documento corregido y enviado a revisión.',
    draftSaved: 'Borrador guardado correctamente.',
    draftPublished: 'Borrador enviado a revisión correctamente.',
    documentDeleted: 'Documento eliminado correctamente.',
    documentHardDeleted: 'Documento eliminado permanentemente.',
    documentApproved: 'Documento aprobado y publicado correctamente.',
    documentRejected: 'Documento devuelto al curador con la nota de corrección.',
    documentRejectedRevisor: 'Documento rechazado. El curador recibirá sus observaciones.',
    documentPublishedRevisor: 'Documento publicado correctamente.',
    noteCreated: 'Nota registrada correctamente.',
    noteSent: 'Nota enviada al curador.',
    noteDeleted: 'Nota eliminada.',
    temaCreated: 'Tema principal creado correctamente.',
    temaDeleted: 'Tema eliminado correctamente.',
    staffAssigned: 'Personal asignado correctamente.',
    tipoDocumentoCreated: 'Tipo documental creado correctamente.',
    tipoNormaCreated: 'Tipo de norma creado correctamente.',
    categoriaCreated: 'Categoría creada correctamente.',
    categoriaSuggested:
      'Categoría sugerida correctamente. Un administrador la revisará antes de poder asignarla.',
    etiquetaCreated: 'Etiqueta creada correctamente.',
    etiquetaSuggested:
      'Etiqueta sugerida. Quedará pendiente de moderación y se incluirá en este documento.',
    etiquetaDeleted: 'Etiqueta eliminada correctamente.',
    sugerenciaAprobada: 'Sugerencia aprobada correctamente.',
    sugerenciaRechazada: 'Sugerencia rechazada correctamente.',
    productCreated: 'Producto creado correctamente.',
    articuloCreated: 'Artículo creado correctamente.',
    userCreated: 'Usuario creado correctamente.',
    passwordUpdated: 'Contraseña actualizada correctamente.',
    estadoLegalUpdated: 'Estado legal actualizado.',
    matrixUploaded: 'Archivo cargado correctamente.',
  },
  error: {
    loadDocument: 'No pudimos cargar el documento.',
    loadNotes: 'No pudimos cargar las notas.',
    loadTiposDocumento: 'No pudimos cargar los tipos documentales de este tema.',
    saveDocument: 'No pudimos guardar el documento.',
    saveDraft: 'No pudimos guardar el borrador.',
    uploadDocument: 'No pudimos cargar el documento al servidor.',
    uploadCorsOrNetwork:
      'No pudimos enviar el archivo al servidor. Compruebe su conexión o contacte al administrador si el problema continúa.',
    deleteDocument: 'No pudimos eliminar el documento.',
    hardDeleteDocument: 'No pudimos eliminar el documento de forma permanente.',
    hardDeleteForbidden: 'Solo un administrador puede eliminar documentos de forma permanente.',
    publishDocument: 'No pudimos publicar el documento.',
    approveDocument: 'No pudimos aprobar el documento.',
    rejectDocument: 'No pudimos rechazar el documento.',
    createNote: 'No pudimos registrar la nota.',
    deleteNote: 'No pudimos eliminar la nota.',
    createTema: 'No pudimos crear el tema.',
    deleteTema: 'No pudimos eliminar el tema.',
    saveAssignments: 'No pudimos guardar las asignaciones.',
    createTipoDocumento: 'No pudimos crear el tipo documental.',
    createTipoNorma: 'No pudimos crear el tipo de norma.',
    updateEstadoLegal: 'No pudimos actualizar el estado legal.',
    login: 'No pudimos iniciar sesión. Verifique sus credenciales.',
    uploadMatrix: 'No pudimos cargar el archivo.',
    partialUpload: 'El documento se guardó, pero hubo un problema al completar el proceso.',
    partialResubmit: 'Los cambios se guardaron, pero no pudimos reenviar el documento a revisión.',
    createEtiqueta: 'No pudimos crear la etiqueta.',
    deleteEtiqueta: 'No pudimos eliminar la etiqueta.',
    suggestCategoria: 'No pudimos enviar la sugerencia de categoría.',
    approveSugerencia: 'No pudimos aprobar la sugerencia.',
    rejectSugerencia: 'No pudimos rechazar la sugerencia.',
  },
} as const

const BACKEND_ERROR_TRANSLATIONS: Record<string, string> = {
  Unauthorized: USER_MSG.common.notAuthorized,
  Forbidden: USER_MSG.common.notAuthorized,
  'Not Found': 'No encontramos el recurso solicitado.',
  'Bad Request': 'Los datos enviados no son válidos. Revise el formulario.',
  'Internal Server Error': 'El servidor encontró un problema. Intente más tarde.',
  'each value in': 'cada valor de',
  'must be a UUID': 'debe ser un identificador válido (UUID)',
  'must be a string': 'debe ser texto',
  'must be a number': 'debe ser un número',
  'should not be empty': 'no puede estar vacío',
  'must be an email': 'debe ser un correo electrónico válido',
  'is not valid': 'no es válido',
  'already exists': 'ya existe en el sistema',
  'too short': 'es demasiado corto',
  'too long': 'es demasiado largo',
  Conflict: 'Ese registro ya existe o está en uso.',
  'Payload Too Large': 'El archivo es demasiado grande.',
  'Unsupported Media Type': 'El tipo de archivo no es compatible.',
  'Cannot GET': 'El servicio solicitado no está disponible.',
  'Cannot POST': 'No se pudo completar la operación en el servidor.',
}

const API_FIELD_LABELS: Record<string, string> = {
  temaPrincipal: 'tema principal',
  categoriaIds: 'categorías',
  tipoNorma: 'tipo de norma',
  enteEmisor: 'ente emisor',
  fechaPublicacion: 'fecha de publicación',
  titulo: 'título',
  tituloIntegro: 'título íntegro',
  nombreBreve: 'nombre breve',
  file: 'archivo',
  comentarios: 'comentarios',
  subcarpetaNormaId: 'tipo documental',
  carpetaInternaId: 'clasificación interna',
  metadatos: 'metadatos',
}

/** Patrones técnicos → mensaje amigable (orden: más específico primero). */
const TECHNICAL_ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /signBlob|signed\s*url|url\s*firmada|iam\.serviceAccounts/i,
    message: USER_MSG.preview.unavailable,
  },
  {
    pattern: /permission.*denied|PERMISSION_DENIED|403.*storage|access denied/i,
    message: 'No tenemos permiso para acceder al archivo en este momento. Intente más tarde.',
  },
  {
    pattern: /ECONNREFUSED|ENOTFOUND|fetch failed|network error|Failed to fetch/i,
    message: USER_MSG.common.connection,
  },
  {
    pattern: /TimeoutError|timeout|timed out|ETIMEDOUT/i,
    message: USER_MSG.common.timeout,
  },
  {
    pattern: /jwt|token.*expir|TOKEN_EXPIRED|invalid token|Unauthorized/i,
    message: USER_MSG.common.sessionExpired,
  },
  {
    pattern: /No such object|not found in bucket|404.*storage/i,
    message: 'No encontramos el archivo del documento. Es posible que aún se esté procesando.',
  },
  {
    pattern: /statusCode["']?\s*:\s*500|Internal Server Error/i,
    message: 'El servidor encontró un problema. Intente más tarde.',
  },
]

function apiFieldLabel(field: string): string {
  return (
    API_FIELD_LABELS[field] ??
    field
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim()
  )
}

/** Traduce mensajes comunes del backend (inglés / validación) al español. */
export function translateBackendError(message: string): string {
  if (BACKEND_ERROR_TRANSLATIONS[message]) {
    return BACKEND_ERROR_TRANSLATIONS[message]
  }

  let translated = message

  translated = translated.replace(
    /property\s+(\w+)\s+should not exist/gi,
    (_, field: string) => `El campo «${apiFieldLabel(field)}» no está permitido.`,
  )

  translated = translated.replace(
    /(\w+)\s+must be a UUID/gi,
    (_, field: string) => `«${apiFieldLabel(field)}» debe ser un identificador válido.`,
  )

  translated = translated.replace(
    /(\w+)\s+must be an array/gi,
    (_, field: string) => `«${apiFieldLabel(field)}» debe ser una lista.`,
  )

  for (const [english, spanish] of Object.entries(BACKEND_ERROR_TRANSLATIONS)) {
    translated = translated.replace(
      new RegExp(`(\\w+)\\s+${english}`, 'gi'),
      (_, field: string) => `«${apiFieldLabel(field)}» ${spanish}.`,
    )
    if (translated.toLowerCase().includes(english.toLowerCase())) {
      translated = translated.replace(new RegExp(english, 'gi'), spanish)
    }
  }

  return translated
}

function looksTechnical(message: string): boolean {
  return (
    message.length > 180 ||
    /[{}\[\]"]/.test(message) ||
    /statusCode|errorId|stack|at\s+\w+\./i.test(message) ||
    /iam\.|serviceAccount|signBlob|Cannot\s+(GET|POST|PUT|DELETE)/i.test(message)
  )
}

/**
 * Convierte un mensaje crudo (backend, red, validación) en texto apto para el usuario.
 */
export function toUserFacingMessage(
  raw: string | null | undefined,
  fallback: string = USER_MSG.common.unknown,
): string {
  if (!raw || !raw.trim()) {
    return fallback
  }

  const trimmed = raw.trim()

  for (const { pattern, message } of TECHNICAL_ERROR_PATTERNS) {
    if (pattern.test(trimmed)) {
      return message
    }
  }

  const translated = translateBackendError(trimmed)

  if (looksTechnical(translated)) {
    return fallback
  }

  return translated
}

/** Título + detalle para toasts de error. */
export function formatUserError(
  title: string,
  detail?: string | null,
  fallbackDetail: string = USER_MSG.common.tryAgainLater,
): { title: string; description?: string } {
  const description = detail ? toUserFacingMessage(detail, fallbackDetail) : undefined
  if (description === title) {
    return { title }
  }
  return { title, description }
}
