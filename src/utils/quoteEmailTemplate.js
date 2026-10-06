/** Self-contained so the workflow builder can embed the same tested renderer in n8n. */
export function prepareQuoteEmail(data) {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
  const amount = Number(data.amountCrc);
  const date = new Date(`${String(data.validUntil || '').slice(0, 10)}T12:00:00Z`);
  if (!data.requestId || !Number.isSafeInteger(amount) || amount <= 0 || (data.currency && data.currency !== 'CRC') || !validEmail(data.customerEmail) || !validEmail(data.adminEmail) || !Number.isFinite(date.getTime()) || !data.notes) {
    throw new Error('La cotización o sus destinatarios no son válidos.');
  }
  const money = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(amount);
  const until = new Intl.DateTimeFormat('es-CR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
  // n8n Code nodes do not expose the browser/Node URL global. Keep this
  // embedded renderer self-contained and accept only explicit HTTP origins.
  const origin = /^(https?):\/\/([a-z0-9.-]+|\[::1\])(?::([0-9]{1,5}))?(?:[/?#][^\s]*)?$/i.exec(String(data.appUrl || 'http://localhost:5173'));
  if (!origin || (origin[3] && (Number(origin[3]) < 1 || Number(origin[3]) > 65535))) throw new Error('Dirección de la app inválida.');
  const accountUrl = escape(`${origin[1]}://${origin[2]}${origin[3] ? `:${origin[3]}` : ''}/cuenta`);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(origin[2].toLowerCase());
  const row = (label, value) => `<tr><td style="padding:12px 0;border-bottom:1px solid #ded7cd;color:#71675e;width:35%;font-size:14px">${label}</td><td style="padding:12px 0;border-bottom:1px solid #ded7cd;color:#201b16;font-size:15px;text-align:right;word-break:break-word">${escape(value)}</td></tr>`;
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:#ece6dc;font-family:Arial,Helvetica,sans-serif;color:#201b16">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ece6dc"><tr><td align="center" style="padding:24px 12px">
<!--[if mso]><table role="presentation" width="600"><tr><td><![endif]-->
<table role="presentation" align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#faf7f1;border:1px solid #d8cfc2">
<tr><td style="padding:28px 24px;background:#181510;border-bottom:3px solid #ff5500"><p style="margin:0;color:#faf7f1;font-size:22px;font-weight:bold;letter-spacing:2px">VÉRTICE <span style="color:#ff5500">CR</span></p><p style="margin:8px 0 0;color:#c0b5a6;font-size:13px">Impresión 3D · Cotización ${escape(data.requestId)}</p></td></tr>
<tr><td style="padding:28px 24px">
<h1 style="margin:0 0 12px;font-size:26px;line-height:1.2">Tu pieza, con los detalles claros.</h1>
<p style="margin:0 0 24px;color:#71675e;font-size:15px;line-height:1.6">${data.test ? 'Esta es una prueba de la cotización.' : `Hola ${escape(data.customerName || '')}.`} Revisá la pieza, el precio y las condiciones. La aprobación o solicitud de cambios se hace desde tu cuenta.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" aria-label="Detalles del encargo">${row('Pieza', data.piece || `Solicitud ${data.requestId}`)}${row('Cantidad', data.quantity || 'Por confirmar')}${row('Polímero propuesto', data.material || 'Por confirmar')}</table>
<p style="margin:24px 0 6px;color:#71675e;font-size:13px">Total de la cotización</p><p style="margin:0;color:#201b16;font-size:34px;font-weight:bold">${money}</p><p style="margin:8px 0 24px;color:#71675e;font-size:14px">CRC · Válida hasta: ${escape(until)}</p>
<h2 style="margin:0 0 10px;font-size:17px">Qué incluye y qué debés revisar</h2><p style="margin:0 0 24px;color:#51483f;font-size:14px;line-height:1.7">${escape(data.notes).replace(/\n/g, '<br>')}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#c84408" style="padding:15px 22px"><a href="${accountUrl}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold">Revisar cotización en mi cuenta →</a></td></tr></table>
${local ? '<p style="margin:14px 0 0;color:#71675e;font-size:13px;line-height:1.5">Enlace de presentación local: abrilo en la computadora donde está ejecutándose Vértice. No es un sitio publicado.</p>' : ''}
<p style="margin:20px 0 0;color:#71675e;font-size:14px;line-height:1.6">En tu cuenta podés aprobar o solicitar cambios cuando la cotización esté enviada para aprobación. Recibir este correo no confirma un pago. La producción empieza después de la verificación del taller.</p>
</td></tr><tr><td style="padding:20px 24px;border-top:1px solid #ded7cd;color:#71675e;font-size:12px;line-height:1.6">VÉRTICE CR · Fabricación bajo pedido<br>Conservá la referencia ${escape(data.requestId)} para el seguimiento de tu pieza.</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
  return { customerEmail: data.customerEmail, adminEmail: data.adminEmail, subject: `${data.test ? '[PRUEBA] ' : ''}Cotización Vértice CR · Solicitud ${data.requestId}`, html, deliveryKey: data.deliveryKey };
}
