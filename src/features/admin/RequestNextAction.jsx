import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sendQuoteEmail, transitionRequest } from '../../services/adminActionsService.js';
import { FDM_MATERIALS, calculateManualQuote } from '../../utils/quotePricing.js';
import { formatCRC } from '../../utils/money.js';
import { isDeliverableEmail } from '../../utils/emailAddress.js';
import { AutomaticQuote } from './AutomaticQuote.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { QuoteFulfillment } from './QuoteFulfillment.jsx';

const today = () => new Date().toISOString().slice(0, 10);

function initialInputs(request) {
  const saved = request.quotePricing?.inputs || {};
  return {
    material: saved.material || (FDM_MATERIALS.includes(request.material) ? request.material : ''),
    weightGrams: saved.weightGrams ?? '',
    printHours: saved.printHours ?? '',
    filamentUsdPerKg: saved.filamentUsdPerKg ?? '',
    wearUsdPerKg: saved.wearUsdPerKg ?? '',
    usdToCrc: saved.usdToCrc ?? '',
    printerPowerWatts: saved.printerPowerWatts ?? '',
    electricityCrcPerKwh: saved.electricityCrcPerKwh ?? '',
    postProcessMinutesPerPiece: saved.postProcessMinutesPerPiece ?? 0,
    laborCrcPerHour: saved.laborCrcPerHour ?? '',
    designHours: saved.designHours ?? 0,
    designCrcPerHour: saved.designCrcPerHour ?? '',
    otherCostsCrc: saved.otherCostsCrc ?? 0,
    markupPercent: saved.markupPercent ?? '',
    ratesCheckedAt: saved.ratesCheckedAt || today(),
  };
}

const FIELDS = [
  ['weightGrams', 'Peso por pieza (g) · laminador', 'Piece weight (g) · slicer', '0.01', '0.01'],
  ['printHours', 'Tiempo de impresión por pieza (h)', 'Print time per piece (h)', '0.01', '0.01'],
  ['filamentUsdPerKg', 'Precio actual del filamento (USD/kg)', 'Current filament price (USD/kg)', '0.01', '0.01'],
  ['wearUsdPerKg', 'Desgaste asignado al material (USD/kg)', 'Wear assigned to material (USD/kg)', '0.01', '0'],
  ['usdToCrc', 'Tipo de cambio BCCR (₡ por USD)', 'BCCR exchange rate (CRC per USD)', '0.0001', '0.0001'],
  ['printerPowerWatts', 'Potencia media durante impresión (W)', 'Average power while printing (W)', '1', '0.01'],
  ['electricityCrcPerKwh', 'Tarifa eléctrica (₡/kWh)', 'Electricity tariff (CRC/kWh)', '0.01', '0.01'],
  ['postProcessMinutesPerPiece', 'Postprocesado por pieza (min)', 'Post-processing per piece (min)', '1', '0'],
  ['laborCrcPerHour', 'Mano de obra (₡/hora · si hay postprocesado)', 'Labor (CRC/hour · if post-processing)', '1', '0'],
  ['designHours', 'Diseño para este pedido (h)', 'Design for this order (h)', '0.01', '0'],
  ['designCrcPerHour', 'Diseño (₡/hora · si requiere diseño)', 'Design (CRC/hour · if design is needed)', '1', '0'],
  ['otherCostsCrc', 'Otros costos incluidos (₡)', 'Other included costs (CRC)', '1', '0'],
  ['markupPercent', 'Recargo sobre costo (%)', 'Markup on cost (%)', '0.1', '0'],
];

export function RequestNextAction({ request, user, language, onSaved }) {
  const auth = useAuth();
  const es = language === 'es';
  const [inputs, setInputs] = useState(() => initialInputs(request));
  const [validUntil, setValidUntil] = useState(request.quoteValidUntil?.slice(0, 10) || '');
  const [notes, setNotes] = useState(request.quoteNotes || '');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const busy = status === 'loading';
  const quote = useMemo(() => calculateManualQuote(inputs, Number(request.quantity)), [inputs, request.quantity]);
  const costingChanged = request.quotePricing
    ? Object.keys(inputs).some(key => String(inputs[key]) !== String(request.quotePricing.inputs?.[key] ?? ''))
    : false;

  async function act(action) {
    if (busy) return;
    setStatus('loading'); setMessage('');
    try {
      await transitionRequest({ requestId: request.id, actorId: user.id, expectedStatus: request.status,
        expectedVersion: request.quoteVersion || 0, action, pricingInputs: inputs, validUntil, notes }, { token: auth?.token });
      setStatus('success');
      setMessage(action === 'reopen-review'
        ? (es ? 'Solicitud devuelta a revisión técnica.' : 'Request returned to technical review.')
        : (es ? 'Cálculo y cotización guardados en el historial.' : 'Calculation and quote saved to the history.'));
      onSaved();
    } catch (error) {
      setStatus('error');
      setMessage(error.code === 'INVALID_QUOTE'
        ? (es ? 'Completá los datos técnicos y tarifas vigentes, el alcance y una fecha futura. El servidor vuelve a validar el cálculo.' : 'Complete technical data and current rates, scope and a future date. The server validates the calculation again.')
        : error.code === 'STATUS_CONFLICT' ? (es ? 'La solicitud cambió. Recargala antes de continuar.' : 'This request changed. Reload it before continuing.')
          : (es ? 'No se pudo guardar. Revisá la conexión y volvé a intentar.' : 'Could not save. Check the connection and try again.'));
    }
  }

  async function sendQuote() {
    if (busy || request.status !== 'QUOTED' || !canSendQuote) return;
    setStatus('loading'); setMessage('');
    try {
      await sendQuoteEmail({ requestId: request.id, actorId: user.id, expectedVersion: request.quoteVersion || 0 }, { token: auth?.token });
      setStatus('success');
      setMessage(es ? 'Correo enviado al cliente con copia oculta para vos. La solicitud quedó esperando aprobación.' : 'Email sent to the customer with a blind copy to you. The request is now awaiting approval.');
      onSaved();
    } catch (error) {
      const copy = {
        QUOTE_EMAIL_NOT_CONFIGURED: es ? 'El envío todavía no está conectado. Configurá el webhook seguro de cotizaciones y la cuenta Gmail en n8n.' : 'Email delivery is not connected yet. Configure the secure quote webhook and Gmail credential in n8n.',
        QUOTE_EMAIL_RECIPIENT_INVALID: es ? 'No se envió: uno de los correos falta, es inválido o pertenece a los datos de ejemplo. Corregí el correo real de la cuenta antes de enviar.' : 'Not sent: an address is missing, invalid or uses sample data. Correct the account email before sending.',
        QUOTE_EXPIRED: es ? 'La vigencia de esta cotización terminó. Actualizá la fecha y guardá una nueva versión antes de enviarla.' : 'This quote has expired. Update its validity date and save a new version before sending.',
        QUOTE_EMAIL_DELIVERY_FAILED: es ? 'n8n no confirmó el envío. La cotización sigue guardada y no pasó a aprobación; revisá la actividad de n8n antes de volver a intentar.' : 'n8n did not confirm delivery. The quote remains saved and was not moved to approval; check n8n activity before retrying.',
        QUOTE_EMAIL_SENT_BUT_NOT_RECORDED: es ? 'El proveedor pudo haber enviado el correo, pero no se pudo guardar el historial. Revisá la bandeja antes de reintentar para evitar duplicados.' : 'The provider may have sent the email, but the history could not be saved. Check the inbox before retrying to avoid a duplicate.',
        STATUS_CONFLICT: es ? 'La solicitud cambió. Recargala antes de continuar.' : 'This request changed. Reload it before continuing.',
        QUOTE_EMAIL_DELIVERY_UNCERTAIN: es ? 'No se confirmó la entrega. Revisá n8n y Gmail antes de repetir: podría haberse enviado.' : 'Delivery is uncertain. Check n8n and Gmail before retrying: it may have been sent.',
      };
      setStatus('error');
      setMessage(copy[error.code] || (es ? 'No se pudo enviar el correo. La cotización permanece guardada.' : 'Could not send the email. The quote remains saved.'));
    }
  }

  const editable = ['IN_REVIEW', 'QUOTED', 'CHANGES_REQUESTED'].includes(request.status);
  if (user?.role !== 'admin') return null;
  const canSendQuote = isDeliverableEmail(request.customerEmail) && isDeliverableEmail(user.email)
    && Number.isSafeInteger(request.quotedPrice) && request.quotedPrice > 0 && request.currency === 'CRC'
    && Boolean(request.quoteNotes?.trim())
    && !costingChanged && (!request.quotePricing || String(quote?.breakdown.amountCrc) === String(request.quotedPrice))
    && validUntil === request.quoteValidUntil?.slice(0, 10) && notes === (request.quoteNotes || '');
  const update = key => event => setInputs(current => ({ ...current, [key]: event.target.value }));

  return <section className="admin-next-action" aria-labelledby="request-next-title" aria-busy={busy}>
    <header><span className="admin-eyebrow">{es ? 'Tu siguiente paso' : 'Your next step'}</span><h2 id="request-next-title">
      {request.status === 'QUOTED'
        ? (es ? 'Cotización registrada · Lista para enviar' : 'Quote recorded · Ready to send')
        : editable
          ? (es ? 'Calculá el costo del encargo' : 'Calculate the job cost')
          : request.status === 'SUBMITTED'
            ? (es ? 'Incorporar solicitud recibida' : 'Register received request')
            : (es ? 'Seguimiento del encargo' : 'Job follow-up')}
    </h2></header>
    {['PENDING_QUOTE', 'IN_REVIEW'].includes(request.status) && <AutomaticQuote request={request} onSaved={onSaved} language={language} />}
    {request.status === 'SUBMITTED' && <><p>{es ? 'Esta solicitud se recibió con una etiqueta antigua. Registrala como pendiente para poder iniciar su revisión. Se conservará el estado original en el historial.' : 'This request used an old label. Register it as pending to begin reviewing it. The original status will remain in its history.'}</p>
      <button className="v-button v-button--primary" disabled={busy} onClick={() => act('incorporate-request')}>{es ? 'Registrar como pendiente' : 'Register as pending'}</button></>}
    {request.status === 'QUOTED' && <div className="admin-quote-send">
      <span className="admin-eyebrow">{es ? 'Siguiente paso · correo' : 'Next step · email'}</span>
      <div className="admin-quote-send__summary">
        <p><strong>{es ? 'Monto cotizado:' : 'Quoted price:'}</strong> {formatCRC(request.quotedPrice)}</p>
        {request.quoteValidUntil && <p><strong>{es ? 'Vigente hasta:' : 'Valid until:'}</strong> {request.quoteValidUntil.slice(0, 10)}</p>}
        {request.quoteNotes && <p><strong>{es ? 'Condiciones:' : 'Terms:'}</strong> {request.quoteNotes}</p>}
      </div>
      <p className="admin-quote-send__recipients">{es ? <>Para: {request.customerEmail || 'correo de cliente sin registrar'}<br />Copia oculta: {user.email}</> : <>To: {request.customerEmail || 'customer email not recorded'}<br />Blind copy: {user.email}</>}</p>
      {(!isDeliverableEmail(request.customerEmail) || !isDeliverableEmail(user.email)) && <p className="admin-quote-send__warning">{es ? 'Los datos actuales contienen correos de ejemplo o inválidos. Se bloqueará cualquier envío hasta tener direcciones reales.' : 'Current data contains sample or invalid email addresses. Sending is blocked until real addresses are available.'}</p>}
      <div className="admin-quote-send__actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button className="v-button v-button--primary" type="button" disabled={busy || !canSendQuote} onClick={sendQuote}>{busy ? (es ? 'Enviando correo…' : 'Sending email…') : (es ? 'Enviar al cliente y copiarme' : 'Send to customer and copy me')}</button>
        <button className="v-button v-button--ghost" type="button" disabled={busy} onClick={() => act('reopen-review')}>{busy ? (es ? 'Actualizando…' : 'Updating…') : (es ? 'Devolver a revisión técnica' : 'Return to technical review')}</button>
      </div>
    </div>}
    {request.status === 'CHANGES_REQUESTED' && <aside className="admin-quote-send__summary"><h3>{es ? 'Cambios solicitados por el cliente' : 'Customer requested changes'}</h3><p>{request.customerDecisionReason || (es ? 'No se registró un motivo.' : 'No reason recorded.')}</p><p>{es ? `Revisá el alcance y guardá la versión ${(request.quoteVersion || 0) + 1}. Después podrás enviarla para una nueva aprobación.` : 'Review the scope and save a new version, then send it for approval.'}</p></aside>}
    {editable && <form onSubmit={event => { event.preventDefault(); act('save-quote'); }}>
      <details open={['IN_REVIEW', 'CHANGES_REQUESTED'].includes(request.status) || request.quotePricing?.mode === 'MANUAL'}><summary>{request.status === 'QUOTED' ? (es ? 'Ajustar cálculo o parámetros técnicos' : 'Adjust calculation or technical parameters') : (es ? 'Costeo avanzado · datos reales o ajuste manual' : 'Advanced costing · real data or manual adjustment')}</summary>
      <p>{es ? `Usá los datos del laminador por pieza y costos actuales del taller. La cantidad solicitada es ${request.quantity}; el diseño se calcula una vez por pedido.` : `Use slicer data per piece and current shop costs. Requested quantity is ${request.quantity}; design is calculated once per order.`}</p>
      <div className="admin-quote-material"><label>{es ? 'Material confirmado' : 'Confirmed material'}<select required value={inputs.material} onChange={update('material')} disabled={busy}>
        <option value="">{es ? 'Seleccioná un material' : 'Select a material'}</option>{FDM_MATERIALS.map(material => <option key={material} value={material}>{material}</option>)}
      </select></label><p>{es ? 'No elijas material solo por lo que pidió el cliente si no está confirmado para fabricación.' : 'Do not select a material solely from the customer request unless it is confirmed for production.'}</p></div>
      <fieldset className="admin-quote-inputs"><legend>{es ? 'Producción y costos vigentes' : 'Production and current costs'}</legend>
        {FIELDS.map(([key, labelEs, labelEn, step, min]) => {
          const optionalWorkRate = (key === 'laborCrcPerHour' && Number(inputs.postProcessMinutesPerPiece) === 0)
            || (key === 'designCrcPerHour' && Number(inputs.designHours) === 0);
          return <label key={key}>{es ? labelEs : labelEn}<input type="number" inputMode="decimal" min={min} step={step} required={!optionalWorkRate} value={inputs[key]} onChange={update(key)} disabled={busy || optionalWorkRate} /></label>;
        })}
        <label>{es ? 'Fecha en que verificaste las tarifas' : 'Date rates were checked'}<input type="date" required value={inputs.ratesCheckedAt} onChange={update('ratesCheckedAt')} disabled={busy} /></label>
      </fieldset>
      <p className="admin-quote-source-note">{es ? <>Para potencia, usá una medición promedio durante impresión (idealmente medidor en el enchufe), no el máximo de la etiqueta. Usá como referencia el <a href="https://gee.bccr.fi.cr/indicadoreseconomicos/IndicadoresEconomicos/frmEstructuraInformacion.aspx?DesTitulo=Tipos+de+Cambio&amp;codMenu=+71&amp;idioma=1" target="_blank" rel="noreferrer">tipo de cambio de venta BCCR</a> y tu factura o la <a href="https://aresep.go.cr/electricidad/tarifas/" target="_blank" rel="noreferrer">tarifa de ARESEP</a> que corresponda a tu distribuidora/servicio. La electricidad no sigue automáticamente el dólar: guardamos ambas tasas por separado y con fecha.</> : <>Use the measured average printer power while printing (ideally a plug-in meter), not the maximum on its label. Use the <a href="https://gee.bccr.fi.cr/indicadoreseconomicos/IndicadoresEconomicos/frmEstructuraInformacion.aspx?DesTitulo=Tipos+de+Cambio&amp;codMenu=+71&amp;idioma=1" target="_blank" rel="noreferrer">BCCR USD selling reference</a> and your bill or the relevant <a href="https://aresep.go.cr/electricidad/tarifas/" target="_blank" rel="noreferrer">ARESEP rate</a>. Electricity does not automatically track USD; both rates are stored separately with a date.</>}</p>
      {quote && <section className="admin-quote-calculation" aria-live="polite" aria-label={es ? 'Desglose del cálculo' : 'Calculation breakdown'}>
        <header><div><span className="admin-eyebrow">{es ? 'Estimación transparente' : 'Transparent estimate'}</span><h3>{es ? 'Desglose para' : 'Breakdown for'} {request.quantity} {es ? 'pieza(s)' : 'piece(s)'}</h3></div><strong>{formatCRC(quote.breakdown.amountCrc)}</strong></header>
        <dl>{[[es ? 'Material' : 'Material', quote.breakdown.materialCrc], [es ? 'Desgaste del material' : 'Material wear', quote.breakdown.wearCrc], [es ? 'Electricidad' : 'Electricity', quote.breakdown.electricityCrc], [es ? 'Postprocesado' : 'Post-processing', quote.breakdown.postProcessCrc], [es ? 'Diseño' : 'Design', quote.breakdown.designCrc], [es ? 'Otros costos' : 'Other costs', quote.breakdown.otherCostsCrc], [es ? 'Costo calculado' : 'Calculated cost', quote.breakdown.costSubtotalCrc]].map(([label, amount]) => <div key={label}><dt>{label}</dt><dd>{formatCRC(amount)}</dd></div>)}</dl>
        <p>{es ? `Recargo ${quote.breakdown.markupPercent}% · total propuesto ${formatCRC(quote.breakdown.amountCrc)}. No incluye impuestos, envío ni gastos que no hayas agregado en “Otros costos”.` : `Markup ${quote.breakdown.markupPercent}% · proposed total ${formatCRC(quote.breakdown.amountCrc)}. Taxes, shipping and costs not entered under “Other costs” are excluded.`}</p>
      </section>}
      <label className="admin-quote-notes">{es ? 'Alcance y condiciones para el cliente' : 'Scope and terms for the customer'}<textarea required maxLength={2000} rows={3} value={notes} onChange={event => setNotes(event.target.value)} disabled={busy} /></label>
      <label className="admin-quote-validity">{es ? 'Cotización válida hasta' : 'Quote valid until'}<input type="date" required value={validUntil} onChange={event => setValidUntil(event.target.value)} disabled={busy} /></label>
      <div className="admin-next-action__buttons"><button className="v-button v-button--primary" disabled={busy || !quote} type="submit">{busy ? (es ? 'Guardando…' : 'Saving…') : (es ? 'Guardar cotización' : 'Save quote')}</button></div>
      </details>
      <p className="admin-quote-formula">{es ? 'Fórmula: gramos × (precio + desgaste) USD/kg × cambio + horas × potencia media (kW) × tarifa eléctrica + postprocesado + diseño + otros costos; luego recargo explícito. Valores guardados como una instantánea del cálculo.' : 'Formula: grams × (filament + wear) USD/kg × exchange rate + print hours × average power (kW) × electricity tariff + post-processing + design + other costs; then explicit markup. Inputs are saved as a calculation snapshot.'}</p>
    </form>}
    <QuoteFulfillment request={request} onSaved={onSaved} language={language} />
    {request.status === 'AWAITING_APPROVAL' && <p>{request.quoteEmailSentAt
      ? (es ? `Correo enviado a ${request.quoteEmailSentTo || 'cliente'} con copia a ${request.quoteEmailCopiedTo || 'taller'}. Ahora corresponde al cliente aprobar la cotización; no la apruebes en su nombre.` : `Email sent to ${request.quoteEmailSentTo || 'customer'} with a copy to ${request.quoteEmailCopiedTo || 'workshop'}. The customer must now approve the quote; do not approve it on their behalf.`)
      : (es ? 'Cotización publicada. Ahora corresponde al cliente aprobarla; el administrador no aprueba en su nombre.' : 'Quote published. Customer approval is the next step; the administrator cannot approve on their behalf.')}</p>}
    {request.status === 'APPROVED' && <p>{request.quotePricing?.mode === 'DEMO' ? (es ? 'El cliente aprobó la cotización técnica. Podés inicializar la orden de taller para programar la producción.' : 'The customer approved the technical quote. You can initialize the workshop order to schedule production.') : (es ? 'El cliente aprobó el encargo. El pago debe confirmarse con su comprobante antes de iniciar fabricación.' : 'The customer approved the job. Confirm payment against its receipt before starting production.')}</p>}
    {request.status === 'PAID' && <p>{request.paymentMode === 'DEMO' ? (es ? 'Orden de fabricación inicializada. El seguimiento de producción continúa en la sección de pedidos.' : 'Manufacturing order initialized. Production tracking continues in the orders section.') : (es ? 'Pago registrado. Coordiná la fabricación según el alcance acordado.' : 'Payment recorded. Coordinate production according to the agreed scope.')}</p>}
    {status !== 'idle' && message && <p role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
    <Link className="admin-action-secondary" to={`/admin/actividad?solicitud=${encodeURIComponent(request.id)}`}>{es ? 'Ver historial del encargo' : 'View job history'} ↗</Link>
  </section>;
}
