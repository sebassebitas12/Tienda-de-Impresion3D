const base = () => globalThis.__VERTICE_JSON_SERVER_URL__ || 'http://localhost:3000';

export async function automationAction(path, payload = {}, { token, signal } = {}) {
  const response = await fetch(`${base()}${path}`, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  if (!response.ok) throw Object.assign(new Error(body.code || 'ACTION_FAILED'), { code: body.code, status: response.status });
  return body;
}

export async function submitQuoteIntake(payload, files = [], { token, signal } = {}) {
  const form = new FormData();
  form.append('payload', JSON.stringify(payload));
  files.forEach(file => form.append('attachments', file, file.name));
  const response = await fetch(`${base()}/quotes/submit-intake`, {
    method: 'POST', signal,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const body = await response.json();
  if (!response.ok) throw Object.assign(new Error(body.code || 'ACTION_FAILED'), { code: body.code, status: response.status });
  return body;
}

export async function readQuoteAttachment(requestId, attachmentId, { token, signal } = {}) {
  return automationAction('/quotes/attachment/read', { requestId, attachmentId }, { token, signal });
}

const assistantErrors = {
  ASSISTANT_NOT_CONFIGURED: { es: 'Falta configurar la asistencia IA. Podés completar y guardar el formulario manualmente.', en: 'AI assistance needs configuration. You can complete and save the form manually.' },
  ASSISTANT_CREDENTIAL_INVALID: { es: 'La conexión IA rechazó la credencial configurada. Revisá la configuración del servicio.', en: 'The AI connection rejected its configured credential. Check service settings.' },
  ASSISTANT_CREDIT_REQUIRED: { es: 'La cuenta del proveedor IA no tiene saldo disponible.', en: 'The AI provider account has no available credit.' },
  ASSISTANT_UNAVAILABLE: {
    es: 'No se pudo conectar con el asistente IA. Intentá de nuevo; los datos del formulario se conservan.',
    en: 'Could not connect to the AI assistant. Retry; form data is preserved.',
  },
  ASSISTANT_TIMEOUT: {
    es: 'El asistente tardó demasiado en responder. Esperá un momento e intentá de nuevo.',
    en: 'The assistant took too long to respond. Wait a moment and retry.',
  },
  ASSISTANT_INVALID_RESPONSE: {
    es: 'La respuesta del asistente no pudo procesarse. Intentá de nuevo.',
    en: 'The assistant response could not be processed. Retry.',
  },
  ASSISTANT_ITERATION_LIMIT: {
    es: 'El asistente no pudo completar la respuesta en esta consulta. Probá enviando un mensaje más corto; tu solicitud no se envió ni se cotizó.',
    en: 'The assistant could not complete this reply. Try a shorter message; your request was not submitted or quoted.',
  },
  ROLE_REQUIRED: {
    es: 'La API local no reconoce la sesión Admin que muestra esta pantalla. Cerrá sesión e iniciá de nuevo en esta misma dirección; no se habilitó ningún acceso adicional.',
    en: 'The local API does not recognize the Admin session shown on this screen. Sign out and sign in again at this same address; no extra access was granted.',
  },
  RATE_LIMIT: {
    es: 'Esperá un minuto antes de volver a consultar.',
    en: 'Wait a minute before sending another question.',
  },
  ATTACHMENT_TYPE_UNSUPPORTED: { es: 'Adjuntá imágenes PNG/JPG/WebP/GIF o modelos STL/OBJ.', en: 'Attach PNG/JPG/WebP/GIF images or STL/OBJ models.' },
  TOO_MANY_ATTACHMENTS: { es: 'Podés adjuntar hasta 5 archivos.', en: 'You can attach up to 5 files.' },
  ENDPOINT_RETIRED_USE_SUBMIT_INTAKE: { es: 'El flujo anterior generaba una cotización al crear la solicitud. Ahora enviá el resumen para que el taller lo cotice.', en: 'The previous flow priced the request automatically. Submit the summary for the workshop to quote it.' },
};

export const automationError = (code, language = 'es') => assistantErrors[code]?.[language === 'en' ? 'en' : 'es'] || (language === 'en' ? 'Could not answer. Check your connection and try again.' : ({
  QUOTE_NOT_READY: 'Hace falta una cotización vigente con desglose, aprobada por su cliente.',
  PAYMENT_EVIDENCE_REQUIRED: 'Indicá el comprobante y confirmá que verificaste el monto completo.',
  PAYMENT_PROOF_OUTDATED: 'El cliente actualizó el comprobante mientras revisabas. Actualizá el pedido para verificar la evidencia más reciente.',
  PAYMENT_VERIFICATION_REQUIRED: 'Para confirmar un pedido en PENDING se debe validar el comprobante de pago primero.',
  PAYMENT_MODE_INVALID: 'Un encargo DEMO no puede registrar un cobro real.',
  CUSTOMER_REQUIRED: 'Esta opción requiere una cuenta de cliente. Administración tiene su propio flujo de cotización.',
  ADMIN_REQUIRED: 'Esta acción requiere la sesión de Administración.',
  CATEGORY_IN_USE: 'Esta categoría tiene piezas asociadas. Reasignalas antes de eliminarla.',
  PRODUCT_IN_USE: 'La pieza forma parte de un pedido. Podés ocultarla para conservar el historial.',
  CATALOG_RECORD_NOT_FOUND: 'El registro ya no existe. Pedile a la IA que consulte el catálogo de nuevo.',
  CATALOG_DUPLICATE: 'Ya existe una pieza o categoría con ese nombre.',
  CATALOG_CATEGORY_REQUIRED: 'Elegí una categoría existente para esta pieza.',
  CATALOG_PUBLICATION_INCOMPLETE: 'Para publicar faltan material, colores o un precio mayor que cero. Completá la propuesta o guardala como borrador.',
  CATALOG_NAME_REQUIRED: 'La propuesta necesita un nombre.',
  CATALOG_PRICING_REQUIRED: 'Los datos del precio cambiaron. Completá peso y tiempo o indicá un precio.',
  INVALID_CATALOG_FIELDS: 'La propuesta tiene campos inválidos. Pedí una propuesta corregida.',
  INVALID_CATALOG_NUMBER: 'Revisá precio, peso y tiempo: deben ser números válidos.',
  INVALID_CATALOG_ACTION: 'La propuesta no pudo validarse. Volvé a pedirla al asistente.',
    ROLE_REQUIRED: 'El Copiloto Admin es independiente del asistente de Home, pero la API rechazó la sesión actual (403). Cerrá sesión y volvé a entrar con una cuenta Admin en esta misma dirección; no se habilitó ningún acceso adicional.',
  MATERIAL_UNSUPPORTED: 'Este material no tiene un perfil FDM disponible.',
  WORKSHOP_EXCEPTION: 'Este uso necesita evaluación técnica; no admite cotización automática.',
  INVALID_QUANTITY: 'La cantidad debe ser un número entero entre 1 y 100.',
  INVALID_SCALE: 'La escala debe estar entre 50% y 200%.',
  RATE_LIMIT: 'Esperá un minuto antes de volver a consultar.',
  PROFILE_REQUIRED: 'Seleccioná una pieza de referencia. No medimos un STL ni una foto automáticamente.',
  UNSUPPORTED_MATERIAL: 'Este material no tiene un perfil FDM disponible.',
  UNSAFE_APPLICATION: 'Este uso requiere evaluación técnica; no admite cotización automática.',
  STATUS_CONFLICT: 'El registro cambió. Recargá antes de continuar.',
  QUOTE_EXPIRED: 'La cotización venció. Generá una versión nueva.',
  QUOTE_EMAIL_RECIPIENT_INVALID: 'Cotización guardada. Los correos de ejemplo no permiten enviar; necesitás una cuenta con correo real.',
  QUOTE_EMAIL_NOT_CONFIGURED: 'Cotización guardada. Falta conectar/publicar el workflow de correo en n8n.',
  QUOTE_EMAIL_DELIVERY_UNCERTAIN: 'No se pudo confirmar el correo. Revisá la ejecución de n8n antes de reintentar: podría haberse enviado.',
  QUOTE_EMAIL_SENT_BUT_NOT_RECORDED: 'Gmail aceptó el correo, pero falló el registro local. Revisá la ejecución antes de repetir.',
  AUTH_REQUIRED: 'Iniciá sesión para continuar.',
  FORBIDDEN: 'Esta acción no está disponible para tu rol.',
  RATE_LIMITED: 'Esperá un minuto antes de volver a consultar.',
}[code] || 'No se pudo completar. Revisá la conexión y los datos.'));
