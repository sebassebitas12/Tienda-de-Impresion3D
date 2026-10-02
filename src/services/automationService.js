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

export const automationError = code => ({
  QUOTE_NOT_READY: 'Hace falta una cotización vigente con desglose, aprobada por su cliente.',
  PAYMENT_EVIDENCE_REQUIRED: 'Indicá el comprobante y confirmá que verificaste el monto completo.',
  PAYMENT_MODE_INVALID: 'Un encargo DEMO no puede registrar un cobro real.',
  CUSTOMER_REQUIRED: 'Esta opción requiere una cuenta de cliente. Administración tiene su propio flujo de cotización.',
  ADMIN_REQUIRED: 'Esta acción requiere la sesión de Administración.',
  ROLE_REQUIRED: 'Iniciá sesión con el rol correspondiente para usar este asistente.',
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
}[code] || 'No se pudo completar. Revisá la conexión y los datos.');
